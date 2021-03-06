import mpx, { createStore } from '@mpxjs/core'
import Http from "../api/http"
import user from "./user"
import store from './general';


  const state={
    ...user.state,
    // 提现列表
    cashList:[],
    // 分销佣金数据
    fenXiao:[],
    // 我的佣金
    myMoneyData:[],
    // 提现明细数据
    txData:[],
    // 客户数据
    customData:[],
    // 时间
    lalal:[],
    // 数量
    numArray:[],
    arrayTime:[0,0,0,0,0,0,0,0,0,0,0,0],
    totle:0,
    // 当前的年份
    newYear:2019,
    // 更新团队成员数据
    myTeamData:[],
    // 用户数据
    personInData:[],
    // 会员部分佣金明细
    hyMoney:[],
    openIdData:wx.getStorageSync('openIdData'),
    // 审核参数
    isLoginData:Number
  }
  const mutations= {
    // 改变当前年份
    updateLogin(state,t){
      state.isLoginData=t
    },
    // 改变当前年份
    reduceYear(state){
      state.newYear--
    },
    // 更新会员部分money明细
    updateHy(state,t){
      state.hyMoney=t
    },
    addYear(state){
      state.newYear++
    },
    // 更新cashList
    updatePerson(state,t){
      state.cashList=t
    },
    // 分销佣金数据
    updateCash(state,t){
      state.fenXiao=t
    },
    // 更新openid
    updateId(state,t){
      state.openIdData=t
    },
    // 我的佣金数据
    updateMyMoney(state,t){
      state.myMoneyData=t
    },
    // 用户提现明细的数据
    updateTiXian(state,t){
      state.txData=t
    },
    // 用户提现明细的数据
    updateCustomData(state,t){
      state.customData=t
    },
    // 更新注册时间
    updateRegisterDate(state,t){
      state.lalal=t
    },
    // 存储用户数量
    // updateNumber(state,t){
    //   state.num=t
    // },
    // 计算总客户数
    updateAll(state){
      for(let i in state.numArray){
        state.totle+=state.numArray[i]
      }
    },
    // 更新我的团队的数据
    updateMyTeam(state,t){
      state.myTeamData=t
    },
    // 更新用户数据
    updatePersonData(state,t){
      state.personInData=t
    },
    // 清空lalal
    clearLalal(state){
      state.lalal=[]
    },
    clearArray(state,t){
      state.arrayTime=t
    },
    // 更新openid
    updateOpenid(state, t) {
      state.openIdData = t
      wx.setStorageSync('openIdData', t)
    }
  }
  // http://101.200.63.32:8082/matchmaker/getDetail/{id}
  const getters = {}
  const actions = {
    // 查看红娘用户信息
    async getInformation(context){
      const res = await Http.get({
        url:`/matchmaker/getMatchGai/${wx.getStorageSync('matchId')}`,
      })
      context.commit('updatePerson',res.data.rows)
      console.log(66666666,res)
      console.log(66666666,res.data.rows)
    },
    // 查询分销佣金明细
    async getFenxiao(context){
      const res = await Http.get({
        url:`/matchmaker/myDistributionBrokerages/${wx.getStorageSync('matchId')}`,
      })
      context.commit('updateCash',res.data)
      console.log(5555555555555555555,res.data)
      // console.log(66666666,res.data.rows)
    },
    // 查询我的佣金明细
    // http://101.200.63.32:8082/matchmaker/myBrokerages/{matchId} GET
    // url: headPath + "/matchmaker/myBrokerages/" + matchId,
    async getInfo(context){
      const res = await Http.get({
        url:`/matchmaker/myBrokerages/${wx.getStorageSync('matchId')}`,
      })
      context.commit('updateMyMoney',res.data.rows)
      console.log(99999999999999,res)
      console.log(999999999999,res.data.rows)
    },
    // 会员部分参数明细
    async getInfoHy(context){
      const res = await Http.get({
        url:`/matchmaker/myBrokeragesMember/${wx.getStorageSync('matchId')}`,
      })
      context.commit('updateHy',res.data.rows)
      console.log(99999999999999,res)
      console.log(999999999999,res.data.rows)
    },
    // 查询我的提现明细
    async getCashDetail(context){
      const res = await Http.get({
        url:`/matchmaker/putDetail/${wx.getStorageSync('matchId')}`,
      })
      context.commit('updateTiXian',res.data)
      console.log(321321321,res.data)
    },
    // 查询我的客户的信息
    async getCustom({state,commit},{memType,year}){
      const res = await Http.get({
        url:`/matchmaker/getmemberBymonth/${memType}/${year}`,
      })
      commit('updateCustomData',res.data.rows)
      commit('clearArray',[0,0,0,0,0,0,0,0,0,0,0,0])
      for(let i in res.data.rows){
        // console.log(res.data.rows[i].registerDate.slice(5,7))
        state.lalal.push(res.data.rows[i].registerDate.slice(5,7).replace(/\b(0+)/gi,""))
        // state.arrayTime.splice(0,11,0)
        state.arrayTime.splice((state.lalal[i]-1),1,res.data.rows[i].memberNum)
        state.numArray.push(res.data.rows[i].memberNum)
        console.log(494949494949,state.numArray)
        // store.commit('updateAll',res.data.rows[i].memberNum)
      }
      // commit('updateAll',5)
      // commit('updateRegisterDate',state.time)
      console.log(state.lalal)
      // context.commit('updateRegisterDate',res.data.rows[0].registerDate.slice(5,7))
      // const time = 
      // 刷新数据
      console.log(888888877777999,res.data.rows)
    },
    // 支付接口
    async takeMoney({commit},{matchmakerId,putType,putAmount,matchPhone,wechartAccount,openId}){
      const res = await Http.post({
        url:`/matchmaker/pay/putforward`,
        // http://101.200.63.32:8082/matchmaker/pay/putforward 
        data:{
          matchmakerId,
          putType,
          putAmount,
          matchPhone,
          wechartAccount,
          openId
        }
      })
      if(res.data.code=="02"){
        wx.showModal({
          title: '提示',
          content: '提现失败',
          showCancel:false,
          success (res) {
            if (res.confirm) {
      
            }else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        wx.navigateBack({
          delta: 1
        })
      }
      console.log(3333333,res)
    },
    // 查看我的团队人员
    async takeTeam({commit},month){
      const res = await Http.get({
        url:`/matchmaker/myDistributions/${wx.getStorageSync('matchId')}/${month}`
      })
      commit('updateMyTeam',res.data.rows)
      console.log(5555544446666,res.data.rows)
    },
    // 根据id查看详细信息
    async getPersonData({commit}){
      const res = await Http.post({
        url:`/matchmaker/getDetail/${wx.getStorageSync('matchId')}`
      })
      commit('updatePersonData',res.data.rows)
      console.log(999666999666,res.data.rows)
    },
    // 获取openid
    async getOpenid({commit},{jscode}){
      const res = await Http.post({
        // http://101.200.63.32:8082/matchmaker/getOpenId 
        url:`/matchmaker/getOpenId`,
        data:{
          appId:'wx9e4ffe724ae08e0b',
          secret:'0e386d892fbafb2090d6dde4629fffba',
          jscode
        }
      })
      commit('updateOpenid',JSON.parse(res.data.rows).openid)
      console.log(44444444444444444455555555,JSON.parse(res.data.rows).openid)
    },
    // async isLogin({commit,state}){
    //   const res = await Http.post({
    //     url:`/check/getCheckPage`,
    //     data:{
    //       "keys":"checkPage"
    //     }
    //   })
    //   commit('updateLogin',res.data.rows)
    //   // if(res.data.rows!=0){
    //   //   wx.reLaunch({
    //   //     url: '../pages/login'
    //   //   })
    //   // }else{
    //   //   wx.reLaunch({
    //   //     url: '../pages/shenhe'
    //   //   })
    //   // }
    //   commit('updateLogin',res.data.rows)
    //   console.log(44444444444444444455555555,res)
    //   console.log(44444444444444444455555555,state.isLoginData)
    // }
    // async getCodeStore(context,tel){
    //   const res = await Http.get({
    //     url : `/sms/send/${tel}/0`,
    //   })
    //   context.commit('upCode',res)
    // }
  }
export default {
  actions,
  mutations,
  state
}
