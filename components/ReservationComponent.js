import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animatable from "react-native-animatable";
import { Permissions, Notifications, Calendar } from 'expo';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        });
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission is not granted for Calendar');
            }
        }
        return permission;
    }

    async obtainDefaultCalendarId() {
        let calendar = null;
        if (Platform.OS === 'ios') {
            calendar = await Calendar.getDefaultCalendarAsync();
        } 
        else {
            const calendars = await Calendar.getCalendarsAsync();
            calendar = (calendars) ? (calendars.find(cal => cal.isPrimary) || calendars[0]) : null;
        }
        return (calendar) ? calendar.id : null;
    }

    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();   
        calendarid= await this.this.obtainDefaultCalendarId(); 
        Calendar.createEventAsync(calendarid, {
            "title" : "Restaurante Con Fusion Table Reservation",
            "startDate": Date(Date.parse(date)),
            "endDate" : Date(Date.parse(date))+(2*60*60*1000),
            "timeZone": "Asia/Hong_Kong",
            "location": "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong"
        })
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission is not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: { sound: true },
            android: { sound: true, vibrate: true, color: '#512DA8' }
        });
    }
    
    render() {
        return(
            <ScrollView>
                <Animatable.View animation="zoomIn" duration={2000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker style={styles.formItem} selectedValue={this.state.guests} onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch style={styles.formItem} value={this.state.smoking} onTintColor='#512DA8' onValueChange={(value) => this.setState({smoking: value})}>
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <DatePicker
                            style={{flex: 2, marginRight: 20}}
                            date={this.state.date}
                            format=""
                            mode="datetime"
                            placeholder="select date and time"
                            minDate="2017-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button onPress={() => {Alert.alert("Your reservation OK?", `Number of guests: ${this.state.guests} Smoking? ${this.state.smoking} Date and Time: ${this.state.date}`,
                        [{
                            text: "Cancel", onPress: () => {console.log('Reservation Cancelled'); this.resetForm();
                            }, style: "cancel"
                        },
                        {
                            text: "OK", onPress: () => {this.presentLocalNotification(this.state.date); this.resetForm()
                        }}],
                        { cancelable: false }
                        )}} 
                        title="Reserve" color="#512DA8" accessibilityLabel="Learn more about this purple button"/>
                    </View>
                </Animatable.View>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;