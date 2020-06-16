import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import { Rating, AirbnbRating, Input } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, comment, author) => dispatch(postComment(dishId, rating, comment, author))
});

function RenderDish(props) {

    const dish = props.dish;

    // handleViewRef = ref => this.view = ref;

    const recognizeDrag = ( moveX, moveY, dx, dy) => {
        if (dx < -200)
            return true;
        else
            return false;
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        // onPanResponderGrant: () => {
        //     this.view.rubberBand(1000)
        //     .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        // },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add to Favorites?',
                    'Are you sure you wish to add ' + dish.name + ' to your favorites?',
                    [
                        {
                            text: 'Cancel', onPress: () => console.log('Cancel pressed'), style: 'cancel'
                        },
                        {
                            text: 'OK', onPress: () => props.favorite ? console.log('Already favorite') : props.onPress()
                        }
                    ],
                    { cancelable: false }
                )

            return true;
        }
    });
    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000} /*ref={this.handleViewRef}*/ {...panResponder.panHandlers}>
                    <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image}}>
                        <Text style={{margin: 10}}>
                            {dish.description}
                        </Text>
                        <Icon raised reverse name={ props.favorite ? 'heart' : 'heart-o' } type='font-awesome' color='#f50' onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()} />
                        <Icon raised reverse name='pencil' type='font-awesome' color='#512DA8' onPress={() => props.toggleModal()} />
                    </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        };
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return(
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }

    return(
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList data={comments} renderItem={renderCommentItem} keyExtractor={item => item.id.toString()} />
            </Card>
        </Animatable.View>
    )
}

class Dishdetail extends Component {

    constructor(props) { 
        super(props);
        this.state = {
            favorites: [],
            rating: 3,
            author: '',
            comment: '',
            showModal: false
        };
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }

    handleComment(values) {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    resetForm() {
        this.setState({
            rating: 5,
            author: '',
            comment: ''
        });
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '')
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} favorite={this.props.favorites.some(el => el === dishId)} 
                onPress={() => this.markFavorite(dishId)} toggleModal={() => this.toggleModal()}/>
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false} visible = {this.state.showModal} onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
                        <Rating showRating onFinishRating={this.ratingCompleted} style={{ paddingVertical: 10 }} onFinishRating={rating => this.setState({ rating: rating})} />
                        <Input placeholder='Author' onChangeText={text => this.setState({author: text})} leftIcon={
                            <Icon
                                name={'user'}
                                size={24}
                                color='black'
                                type="font-awesome"
                                margin={1}
                            />
                            }
                        />
                        <Input placeholder='Comment' onChangeText={text => this.setState({comment: text})} leftIcon={
                            <Icon
                                name={'comment'}
                                size={24}
                                color='black'
                                type="font-awesome"
                                margin={1}
                            />
                            }
                        />
                        <Button color = "#512DA8" title="Submit" onPress={() => this.handleComment(dishId)} />
                        <Button color="gray" title="Cancel"  onPress={() => this.toggleModal()} />
                    </View>
                </Modal>
            </ScrollView>   
        );
    }  
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 28
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

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);