import React, { Component } from 'react';
import { Text,StyleSheet,SafeAreaView,View,Image,Button } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Tflite from 'tflite-react-native';

let tflite = new Tflite();
var modelFile = "models/model.tflite";
var labelsFile = "models/labels.txt";
export default class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      recognitions:null,
      source:null,
    };
    tflite.loadModel({model: modelFile, labels:labelsFile}, (err,res)=>{
      if(err) console.log(err);
      else console.log(res);
    });
  }

  selectGalleryImage(){
    const options = {};
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel){
        console.log('User Cancelled Image Picker');
      }else if (response.err){
        console.log('Image Error');
      } else if(response.customButton){
        console.log('User Pressed Custom Button');
      }else{
        //console.log('success')
        this.setState({
          source: {uri: response.uri},
        });
        tflite.runModelOnImage({
          path: response.path,
          imageMean:128,
          imageStd:128,
          numResults: 5,
          threshold: 0.05,
        },
        (err,res) => {
          if (err) console.log(err);
          else{
            console.log(res[res.length -1]);
            this.setState({recognitions:res[res.length - 1]});
          }
        },
        );
      }
    });
  }
  takePhoto(){
    const options = {};
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel){
        console.log('User Cancelled Image Picker');
      }else if (response.err){
        console.log('Image Error');
      } else if(response.customButton){
        console.log('User Pressed Custom Button');
      }else{
        //console.log('success')
        this.setState({
          source: {uri: response.uri},
        });
        tflite.runModelOnImage({
          path: response.path,
          imageMean:128,
          imageStd:128,
          numResults: 5,
          threshold: 0.05,
        },
        (err,res) => {
          if (err) console.log(err);
          else{
            console.log(res[res.length -1]);
            this.setState({recognitions:res[res.length - 1]});
          }
        },
        );
      }
    });
  }

  render(){
    const {recognitions,source} = this.state;
    return(
      <SafeAreaView style ={styles.areaContainer}>
        <View style = {styles.titleContainer}>
          <Text style = {styles.title}>
            Predicting Flowers
          </Text>
          <Text style = {styles.subtitle}>
            Using Python Tensorflow Neural Networks
          </Text>
        </View>
        <View style={styles.imageContainer}>
          {recognitions ? (
            <View>
              <Image source={source} style={styles.flowerImage}/>
              <Text style = {{color:'white',textAlign:'center',paddingTop:10,fontSize:25}}>
                {
                  'I predict:' + recognitions ['label']+' I am '+(recognitions['confidence']*100).toFixed(0)+'% sure'
                }
              </Text>
            </View>
          ) : (
            <Image 
              source ={require('./assets/download.png')} 
              style = {styles.flowerImage}></Image>
          )}
        </View>
        <View style = {styles.buttonContainer}>
          <Button
          onPress = {this.selectGalleryImage.bind(this)} 
          title = 'Camera Roll'>

          </Button>
          <Text></Text>
          <Button 
          onPress = {this.takePhoto.bind(this)}
          title = 'Take a Photo'>
          </Button>
        </View>

      </SafeAreaView>
    )

  }
}
const styles = StyleSheet.create({
  areaContainer:{
    flex:1,
    backgroundColor:'limegreen',
    width:400,
    alignItems:'center',
    paddingTop:100
  },
  buttonContainer:{
    flex:1,
    justifyContent:'center',
    paddingTop:200,
    borderBottomEndRadius:6,
    paddingBottom:50
  },
  title:{
    fontSize: 40,
    fontWeight:'bold',
    color:'white'
  },
  subtitle:{
    color:'red',
    fontSize:16,
    fontWeight:'bold'
  },
  imageContainer:{
    flex:1,
    paddingTop:120,
    alignItems:'center',
    justifyContent:'center'

  },
  flowerImage:{
    width:250,
    height:250
  }
})