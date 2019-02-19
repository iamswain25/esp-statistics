import React from "react";
import { Constants } from "expo";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  CameraRoll
} from "react-native";
import { WebBrowser } from "expo";
const random0to3 = () => {
  return Math.floor(Math.random() * 4);
};
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      answer: random0to3(),
      isOpen: false,
      dailyCounter: 0,
      right: 0,
      photos: [],
      isPhotoOpen: false,
      end_cursor: "",
      photoIndex: 0
    };
    this._resetCameraRoll();
  }
  static navigationOptions = {
    header: null,
    headerStyle: { marginTop: Constants.statusBarHeight }
  };
  _resetCameraRoll = async () => {
    return CameraRoll.getPhotos({
      first: 24,
      after: this.state.end_cursor
    }).then(r => {
      // console.log(r.page_info);
      this.setState({
        photos: r.edges.map(e => e.node.image),
        end_cursor: r.page_info.end_cursor
      });
    });
  };
  _resetGuess = () => {
    // alert("_resetGuess");
    this._resetCameraRoll();
    this.setState(state => ({
      answer: random0to3(),
      isOpen: false,
      isPhotoOpen: false,
      right: 0,
      counter: 0,
      dailyCounter: ++state.dailyCounter
    }));
  };

  _guessedRight = () => {
    // alert("_guessedRight")
    this.setState(state => ({
      right: ++state.right,
      isPhotoOpen: true
    }));
  };

  _onPressButton = index => {
    let timeout = 500;
    if (this.state.answer === index) {
      this._guessedRight();
      timeout = 1500;
    }
    this.setState(state => ({
      counter: ++state.counter,
      isOpen: true
    }));
    setTimeout(() => {
      if (this.state.answer === index) {
        this.setState(state => ({
          photoIndex: ++state.photoIndex
        }));
      }
      this.setState({
        answer: random0to3(),
        isOpen: false,
        isPhotoOpen: false
      });
      if (this.state.counter >= 24) {
        this._resetGuess();
      }
    }, timeout);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <View style={styles.welcomeContainer}>
          <Text style={styles.getStartedText}>
            Daily Counter {this.state.dailyCounter} / 10
          </Text>
          <Text style={styles.getStartedText}>
            Correct {this.state.right}/ 24
          </Text>
        </View>

        <View style={styles.getStartedContainer}>
          <Text style={styles.title}>
            Quite your mind, and guess where the picture is.
          </Text>
          <View style={styles.boxContainer}>
            {["green", "yellow", "red", "blue"].map((color, index) => (
              <TouchableOpacity
                disabled={this.state.isOpen}
                key={index}
                onPress={e => this._onPressButton(index)}
                style={[styles.box, styles[color]]}
              >
                <Image
                  source={require("../assets/images/robot-prod.png")}
                  style={
                    index === this.state.answer && this.state.isOpen
                      ? null
                      : styles.hiddenImage
                  }
                />
              </TouchableOpacity>
            ))}
            {this.state.photos.length > 0 ? (
              <View
                style={
                  this.state.isPhotoOpen ? styles.showImage : styles.hiddenImage
                }
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  resizeMode={"contain"}
                  source={this.state.photos[this.state.photoIndex]}
                />
              </View>
            ) : null}
          </View>
          <Text style={styles.getStartedText}>
            {this.state.counter} / 24 trials
          </Text>
        </View>
      </View>
    );
  }

  _toWebpage = () => {
    WebBrowser.openBrowserAsync("http://espresearch.com");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  boxContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    height: 320,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "space-between",
    alignContent: "space-between"
  },
  hiddenImage: { display: "none" },
  showImage: {
    position: "absolute",
    // display: "flex",
    // flex: 1,
    width: "100%",
    height: "100%"
    // top: 0,
    // overflow: "hidden",
    // justifyContent: "center"
  },
  box: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center"
  },
  red: { backgroundColor: "red" },
  blue: { backgroundColor: "blue" },
  yellow: { backgroundColor: "yellow" },
  green: { backgroundColor: "green" },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  title: {
    fontSize: 24,
    color: "black",
    lineHeight: 30,
    textAlign: "center"
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  },
  statusBar: {
    backgroundColor: "#C2185B",
    height: Constants.statusBarHeight
  }
});
