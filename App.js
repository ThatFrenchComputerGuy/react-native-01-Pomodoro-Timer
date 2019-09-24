import React, {Component} from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import {vibrate} from './utils'

//This function is used for the userInput placeholders general settings
function UserTextInput(props){
    return(
        <TextInput
            {...props}
            editable
            maxLength={2}
            placeholder={'00'}
            keyboardType={'number-pad'}/>
    )
}

export default class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
      minBreak: '00',
      secBreak: '00',
      titleText: 'Work Time: ',
      type:'work',
      storedWorkMinutes:'00',
      storedWorkSeconds:'00',
      storedBreakSeconds:'00',
      storedBreakMinutes:'00',
      showWork: true,
      showBreak: false,
      secWarn:false
    }
  }
  componentWillUnmount() {
      clearInterval(this.state.timer)
  }

  timePicker = (unit,type,input) =>{
      if(type==='work'){
          if(unit==='seconds'){
              if(input === ''){
                  this.setState({seconds_Counter: '00'})
              }
              else{
                  if(Number(input) > 59){
                      this.setState({seconds_Counter: '59',
                          storedWorkSeconds: '59',
                          secWarn:true})
                  }
                  else{
                      this.setState({seconds_Counter: input.length == 1 ? '0' + input : input,
                          storedWorkSeconds: input.length == 1 ? '0' + input : input,
                          secWarn: false})
                  }
              }
          }
          else{
              if(input === ''){
                  this.setState({minutes_Counter: '00'})
              }
              else{
                  this.setState({
                      minutes_Counter: input.length == 1 ? '0' + input : input,
                      storedWorkMinutes: input.length == 1 ? '0' + input : input})
              }
          }
      }
    else if(type==='break'){
          if(unit==='seconds'){
              if(input === ''){
                  this.setState({secBreak: '00'})
              }
              else{
                  if(Number(input) > 59){
                      this.setState({storedBreakSeconds: '59',
                          secBreak: '59',
                          secWarn: true})
                  }
                  else{
                      this.setState({storedBreakSeconds: input.length == 1 ? '0' + input : input,
                          secBreak: input.length == 1 ? '0' + input : input,
                          secWarn: false})
                  }
              }
          }
          else{
              if(input === ''){
                  this.setState({storedBreakMinutes: '00'})
              }
              else{
                  this.setState({storedBreakMinutes: input.length == 1 ? '0' + input : input,
                      minBreak: input.length == 1 ? '0' + input : input})
              }
          }
      }
  }


  Start = () => {
    let timer = setInterval(() => {
        var num, count = this.state.minutes_Counter
      if(this.state.seconds_Counter === '00' && count === '00'){
          clearInterval(this.state.timer)
          num = '00'
      }
      else{
          num = (Number(this.state.seconds_Counter) - 1).toString()
      }

      if (Number(this.state.seconds_Counter) === 0 && count != 0) {
        count = (Number(this.state.minutes_Counter) - 1).toString()
        num = '59'
      }
      if(this.state.seconds_Counter === '01' && this.state.minutes_Counter === '00'){
          vibrate()
      }

      if(this.state.minutes_Counter == 0 && this.state.seconds_Counter== 0 && this.state.type=='work'){
          this.handleBreak()
      }

      this.setState({
        minutes_Counter: count.length == 1 ? '0' + count : count,
        seconds_Counter: num.length == 1 ? '0' + num : num,
      })
    }, 1000)
    this.setState({ timer })

  }

  handleBreak = () => {
      clearInterval(this.state.timer)
      this.setState({titleText:'Break Time', showWork:false, showBreak:true})
      let timer = setInterval(() => {
          var num, count = this.state.minBreak
          if(this.state.secBreak === '00' && count === '00'){
              clearInterval(this.state.timer)
              num = '00'
          }
          else{
              num = (Number(this.state.secBreak) - 1).toString()
          }

          if (Number(this.state.secBreak) === 0 && count != 0) {
              count = (Number(this.state.minBreak) - 1).toString()
              num = '59'
          }
          if(this.state.secBreak === '01' && this.state.minBreak === '00'){
              vibrate()
          }

          this.setState({
              minBreak: count.length == 1 ? '0' + count : count,
              secBreak: num.length == 1 ? '0' + num : num
          })
      }, 1000)
      this.setState({ timer })

  }

  Stop = () => {
    clearInterval(this.state.timer)
  }

  Clear = () => {
    this.timePicker('seconds','work',this.state.storedWorkSeconds)
    this.timePicker('minutes','work',this.state.storedWorkMinutes)
    this.timePicker('minutes','break',this.state.storedBreakMinutes)
    this.timePicker('seconds','break',this.state.storedBreakSeconds)
    this.setState({titleText:'Work Time',showWork:true, showBreak: false})
  }


  render() {
    return (
        <View style={styles.container}>
          <Text style={{fontSize: 46,marginBottom:150}}>Podomoro Timer</Text>
          <Text style={{fontSize: 60, fontWeight: 'bold'}}>{this.state.titleText}</Text>
          {this.state.showWork && <Text style={{fontSize: 56, paddingBottom:10}}>{this.state.minutes_Counter}:{this.state.seconds_Counter}</Text>}
          {this.state.showBreak && <Text style={{fontSize: 56, paddingBottom:10}}>{this.state.minBreak}:{this.state.secBreak}</Text>}
          <View style={styles.activeTimePicker}>
            <View>
                <Text style={styles.selectText}>Work Time:</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={[styles.selectText,{marginLeft:4}]}>Minutes: </Text>
                <UserTextInput style={styles.timeBox} onChangeText={(text) => this.timePicker('minutes','work',text)}/></View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.selectText}>Seconds: </Text>
                <UserTextInput style={styles.timeBox} onChangeText={(text) => this.timePicker('seconds','work',text)}/>
            </View>
          </View>

          <View style={[styles.activeTimePicker,{marginTop: 10,paddingBottom:30}]}>
              <View>
                  <Text style={styles.selectText}>Break Time:</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                  <Text style={styles.selectText}>Minutes: </Text>
                  <UserTextInput style={styles.timeBox} onChangeText={(text) => this.timePicker('minutes','break',text)}/></View>
              <View style={{flexDirection: 'row'}}>
                  <Text style={styles.selectText}>Seconds: </Text>
                  <UserTextInput style={styles.timeBox} onChangeText={(text) => this.timePicker('seconds','break',text)}/>
              </View>
          </View>

          {this.state.secWarn && <Text style={{marginTop:-20, marginBottom:20, marginLeft:150}}>Seconds will be set as '59'</Text>}

          <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
            <TouchableOpacity
                onPress={this.Start}
                style={styles.buttons}>
              <Text style={styles.buttonText}>START</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={this.Stop}
                style={[styles.buttons,{marginHorizontal:20}]} >
              <Text style={styles.buttonText}>STOP</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={this.Clear}
                style={styles.buttons} >
              <Text style={styles.buttonText}>RESET</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent:'flex-start',
    paddingTop:40,
  },
  timer: {
    fontSize: 42,
    fontWeight: '200'
  },
  buttons:{
    paddingHorizontal:25,
    paddingVertical:5,
    backgroundColor:'black',
    borderRadius: 7
  },
  buttonText:{
      color:'white'
  },
  activeTimePicker:{
      flexDirection:'row',
      justifyContent:'space-evenly',
      width:'100%'
  },
  selectText:{
      paddingTop: 2
  },
  timeBox:{
      backgroundColor: 'white',
      paddingLeft:5,
      borderRadius: 5
  }
})
