//处理客户商户转让积分的路由
var express = require('express');
var web3Instance = require('../public/javascripts/utils/ethereumUtils/web3Instance');

//web3初始化
var web3 = web3Instance.web3;

/**
 * 状态码：
 * 0：成功
 * 1：失败
 *
 * @param req
 * senderType:发送者类型，0为用户，1为商户
 * sender：发送者手机号
 * receiver: 接收者手机号
 * score:转让的积分数额
 *
 * @param res
 * code:状态码
 * message:消息
 * txInfo:交易详情
 */
module.exports.transfer = function (req, res){
    console.log("发送参数：" + req.query.senderType + "积分发送者：" + req.query.sender + "；积分接收者：" + req.query.receiver + ";积分数额：" + req.query.score);

    global.contractInstance.transferScore(req.query.senderType, req.query.sender, req.query.receiver, req.query.score, {from: web3.eth.accounts[0]}, function (error, result) {
        if (!error) {
            var eventTransferScore = global.contractInstance.TransferScore();
            eventTransferScore.watch(function (error, result) {
                console.log("状态码：" + result.args.statusCode + "消息：" + result.args.message);
                var response = {
                    code: result.args.statusCode,
                    message: result.args.message,
                    txInfo: result
                };
                eventTransferScore.stopWatching();
                res.send(JSON.stringify(response));
                res.end();
            });
        }
        else {
            console.log("发生错误：" + error);
            var response = {
                code: 1,
                message: error.toString(),
                info: ""
            };
            res.send(JSON.stringify(response));
            res.end();
        }
    });
};
