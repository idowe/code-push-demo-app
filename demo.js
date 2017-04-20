import React, { Component } from "react";
import {
  AppRegistry,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CodePush from "react-native-code-push";

@CodePush({ checkFrequency: CodePush.CheckFrequency.MANUAL })
class CodePushDemoApp extends Component {
  constructor() {
    super();
    this.state = { restartAllowed: true };
  }

  codePushStatusDidChange(syncStatus) {
    console.log(this.setState);
    switch(syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({ syncMessage: "检查更新." });
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ syncMessage: "正在下载更新包." });
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({ syncMessage: "等待操作." });
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ syncMessage: "正在安装更新包." });
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({ syncMessage: "最新版本.", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({ syncMessage: "更新取消.", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({ syncMessage: "更新已经完成.", progress: false });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({ syncMessage: "出现错误.", progress: false });
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({ progress });
  }

  toggleAllowRestart() {
    this.state.restartAllowed
      ? CodePush.disallowRestart()
      : CodePush.allowRestart();

    this.setState({ restartAllowed: !this.state.restartAllowed });
  }

  sync() {
    CodePush.sync(
      {
        installMode: CodePush.InstallMode.IMMEDIATE,
        updateDialog: { 
            title: "有新的更新!",
            optionalIgnoreButtonLabel:"忽略",
            optionalInstallButtonLabel:"安装",
            mandatoryContinueButtonLabel:"继续",
            optionalUpdateMessage:"一个新的更新，你要更新吗？"    
        }
      },
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  render() {
    let syncView, syncButton, progressView;

    if (this.state.syncMessage) {
      syncView = (
        <Text style={styles.messages}>{this.state.syncMessage}</Text>
      );
    } else {
      syncButton = (
        <TouchableOpacity onPress={this.sync.bind(this)}>
          <Text style={styles.syncButton}>开始异步更新!</Text>
        </TouchableOpacity>
      );
    }

    if (this.state.progress) {
      progressView = (
        <Text style={styles.messages}>{this.state.progress.receivedBytes} of {this.state.progress.totalBytes} bytes received</Text>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          欢迎使用热更新服务 V1.0.2!
        </Text>
        <Text style={styles.welcome}>
          https://www.regeng.xin
        </Text>
        {syncButton}
        {syncView}
        {progressView}
        <Image style={styles.image} resizeMode={Image.resizeMode.contain} source={require("./images/laptop_phone_howitworks.png")}/>
        <TouchableOpacity onPress={this.toggleAllowRestart.bind(this)}>
          <Text style={styles.restartToggleButton}>{ this.state.restartAllowed ? "允许" : "不允许"} 重启</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    paddingTop: 50
  },
  image: {
    marginTop: 50,
    width: Dimensions.get("window").width - 100,
    height: 365 * (Dimensions.get("window").width - 100) / 651,
  },
  messages: {
    textAlign: "center",
  },
  restartToggleButton: {
    color: "blue",
    fontSize: 17
  },
  syncButton: {
    color: "green",
    fontSize: 17
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
});

AppRegistry.registerComponent("CodePushDemoApp", () => CodePushDemoApp);
