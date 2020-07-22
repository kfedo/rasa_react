import React from 'react';
import * as Constants from '../../Constants';
import '../../../lib/vad';
import store from "../../../redux/store";
import {EMPTY_TYPE} from "../../../redux/actions/userAction";

class ChatInput extends React.Component {

    constructor(props) {
        super(props);
        this.inputMargin = 60;
        this.audioContext = undefined;
        this.mediaRecorder= {};
        // this.isRecording = false;

        this.analyser = undefined;
        this.canvas= undefined;
        this.ctx= undefined;
        this.canvasHeight= undefined;
        this.canvasWidth= undefined;
        this.countFrame= 0;
        this.recordTime= undefined;
        this.state = {
            chatInput: '',
            showSendButton: false,
            sendDisabled: true,
            inputMargin: this.inputMargin,
            isFlyoutOpen: false,
            isRecording:false,


        };

        this.submitHandler = this.submitHandler.bind(this);
        this.textChangeHandler = this.textChangeHandler.bind(this);
        this.inputFocus = this.inputFocus.bind(this);
        this.inputBlur = this.inputBlur.bind(this);
        this.toggleFlyout = this.toggleFlyout.bind(this);
        this.onFlyoutOptionClick = this.onFlyoutOptionClick.bind(this);
    }
    componentDidMount() {

    }


    startRecord = () =>{
        let loading = this.props.loading;
        if(loading){
            return;
        }
        if(this.state.isRecording){
            this.stopRecording()
            return;
        }
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        // this.audioContext = new AudioContext();
        this.audioContext = new AudioContext({ sampleRate: 16000 });
        this.setState({isRecording :true});
        // Ask for audio device

        navigator.getUserMedia = (
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia
        );

        if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
            navigator.getUserMedia({
                audio: true
            }, this.startUserMedia, e => {
                console.log(`No live audio input in this browser: ${e}`);
            });
        } else {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(this.startUserMedia).catch(e => {
                console.log(`No live audio input in this browser: ${e}`);
            });
        }

    }
    stopRecording = () => {
        if (this.state.isRecording) {
            this.mediaRecorder.stop();
            this.set_stopRecording();
            this.mediaRecorder.exportWAV(this.createFileLink);
            console.log('voice_stop');
        }

    }
    set_stopRecording = () =>{
        this.audioContext.close().then(() => {
            console.log('streaming close');

        });
        this.setState({isRecording :false});

    }
    startUserMedia = (stream) => {
        const vm = this;
        vm.analyser = vm.audioContext.createAnalyser();
        const source = vm.audioContext.createMediaStreamSource(stream).connect(vm.analyser);
        console.log(vm.analyser);

        // eslint-disable-next-line no-undef
        vm.mediaRecorder = new Recorder(source, { numChannels: 1 });
        vm.mediaRecorder.record();

        window.setTimeout(() => {
            if (vm.state.isRecording) {
                vm.mediaRecorder.stop();
                vm.set_stopRecording();
                vm.mediaRecorder.exportWAV(vm.createFileLink);
                console.log('10 seconds, stop recording');
            }
        }, 10000);

        const options = {
            source: source,
            voice_stop: function() {
                /*         This line using Mediarecorder            */

                if (vm.state.isRecording) {
                    vm.mediaRecorder.stop();
                    vm.set_stopRecording();
                    vm.mediaRecorder.exportWAV(vm.createFileLink);
                    console.log('voice_stop');
                }
            },
            voice_start: function() {
                if (vm.state.isRecording) {
                    console.log('voice_start');
                    // } else if (!vm.isRecording && (this.incomeMessage.length === 0)) {
                    // 	console.log('StartRecording');
                    // 	vm.startRecord();
                }
            }
        };
        // Create VAD
        // eslint-disable-next-line no-undef
        const vad = new VAD(options);

    }
    createFileLink =(blob) => {
        const vm = this;
        console.log('recorder stopped');

        this.waitForRespose = true;
        const audioURL = window.URL.createObjectURL(blob);

        const request = new XMLHttpRequest();
        request.open('GET', audioURL, true);
        request.responseType = 'blob';
        request.onload = function() {
            const reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.onload = function(el) {
                // console.log('DataURL:', el.target.result);
                console.log('SEND RESULT TO THE BOT');
                // vm.playMedia(audioURL);
                vm.sendMessageToBot(el.target.result);


            };
        };
        request.send();
    }
    playMedia = (audioPath) => {
        const audio = document.querySelector('.sound-clips');
        audio.setAttribute('controls', '');
        audio.setAttribute('autoplay', '');
        audio.src = audioPath;
    }
    sendMessageToBot = (text) =>{
        store.dispatch({
            type:EMPTY_TYPE,
            loading:true,
        });
        if (text && text.length >= 1 && text.indexOf('data:audio/wav') !== -1) {

            console.log('type: voice');

            this.props.socket.emit('user_uttered', { type:'voice', message: text, room: this.props.userId });
        } else {
            console.log('type: chat');

            this.socket.emit('user_uttered', { type:'chat', message: text, room: this.props.userId });
        }
    }


    //////////////



    submitHandler(event) {
        event.preventDefault();
        if(this.state.chatInput !== '') {
            this.setState({chatInput: '', sendDisabled: true});
            if(this.props.coordinate_lat && this.props.coordinate_long){
                this.props.onSend({
                    messageType: Constants.request.RequestType.TEXT_MESSAGE,
                    messageData: [{text: this.state.chatInput}],
                    message: this.state.chatInput,
                    location:{lat:this.props.coordinate_lat, long:this.props.coordinate_long}
                }, this.state.chatInput);

            } else {
                this.props.onSend({
                    messageType: Constants.request.RequestType.TEXT_MESSAGE,
                    messageData: [{text: this.state.chatInput}],
                    message: this.state.chatInput,
                }, this.state.chatInput);
            }

        }
    }

    toggleOverlay(isFlyoutOpen) {
        if (isFlyoutOpen) {
            this.props.showOverlay();
        }
        else {
            this.props.hideOverlay();
        }
    }

    toggleFlyout() {
        let isFlyoutOpen = !this.state.isFlyoutOpen;
        this.setState({isFlyoutOpen: isFlyoutOpen});
        this.toggleOverlay(isFlyoutOpen);
    }

    inputFocus() {
        this.setState({inputMargin: 0, isFlyoutOpen: false, showSendButton: true});
    }

    inputBlur() {
        let showSendButton = this.state.chatInput.length > 0;
        let inputMargin = showSendButton ? 0 : this.inputMargin;
        // Do not hide send button if user has typed something
        this.setState({inputMargin: inputMargin, showSendButton: showSendButton});
    }

    textChangeHandler(event) {
        let value = event.target.value;
        this.setState({chatInput: value, sendDisabled: value === ''});
    }
    onControlMic = () =>{
        this.props.createSocket();
        this.setState({isFlyoutOpen: false});
        this.toggleOverlay(false);
    }
    onFlyoutOptionClick(event, type) {
        this.setState({isFlyoutOpen: false});
        switch(type) {
            case 'feedback':
                this.props.showFeedback();
                break;
            case 'about':
                this.props.showAbout();
                break;
            case 'start':
                this.props.showStart(true);
                break;
            default :
                this.props.showStart(true);
                break;
        }
        this.toggleOverlay(false);
    }
    onSetSound = () =>{
        if(this.props.isSound){
            store.dispatch({
                type:EMPTY_TYPE,
                isSound:false,
            })
        } else {
            store.dispatch({
                type:EMPTY_TYPE,
                isSound:true,
            })
        }

    }

    render() {
        let sendButtonClass = 'btn btn-fab btn-raised send-button' + (this.state.sendDisabled ? ' disabled' : '');
        let moreButtonClass = 'btn btn-fab btn-raised more-button';
        let moreButtonOptionClass = 'btn btn-raised btn-fab btn-fab-mini';
        let flyoutClass = 'more-button-container' + (this.state.isFlyoutOpen ? ' active' : '');

        if (this.props.isAdmin) {
            return (<div></div>)
        }
        else {
            return (<form onSubmit={this.submitHandler} id="chat-input-container">
                    <fieldset>
                        <div className="form-group">
                            {this.state.inputMargin > 0 && (
                                <div className={flyoutClass}>
                                    <a onClick={(event) => this.onFlyoutOptionClick(event, 'start')} className="button">
                                        <div className={`${moreButtonOptionClass} btn-info`}>
                                            <img src="/images/icon-restart-32.png" />
                                        </div>
                                        <span>Start Over</span>
                                    </a>

                                    <a onClick={(event) => this.onFlyoutOptionClick(event, 'feedback')} className="button">
                                        <div className={`${moreButtonOptionClass} btn-danger`}>
                                            <img src="/images/icon-feedback-32.png" />
                                        </div>
                                        <span>Feedback</span>
                                    </a>
                                    <a onClick={(event) => this.onFlyoutOptionClick(event, 'about')} className="button">
                                        <div className={`${moreButtonOptionClass} btn-success`}>
                                            <img src="/images/icon-about-32.png" />
                                        </div>
                                        <span>About</span>
                                    </a>
                                    <a className={moreButtonClass} onClick={this.toggleFlyout}>
                                        {!this.state.isFlyoutOpen &&
                                        <span className="glyphicon glyphicon-arrow-right" style={{color: "white",fontSize: "29px",top: "12px"}} aria-hidden="true"> </span>
                                        }
                                        {this.state.isFlyoutOpen &&
                                        <span className="glyphicon glyphicon-arrow-up" style={{color: "white",fontSize: "29px",top: "12px"}} aria-hidden="true"> </span>
                                        }

                                    </a>
                                </div>
                            )}


                            <input type="text"
                                   className="form-control"
                                   id="chat-input"
                                   onChange={this.textChangeHandler}
                                   value={this.state.chatInput}
                                   placeholder="Enter Query Here"
                                   autoComplete="off"
                                   style={{marginLeft: this.state.inputMargin}}
                                   onFocus={this.inputFocus}
                                   onBlur={this.inputBlur}
                            />

                            {this.state.showSendButton && (
                                <a href="#" onClick={this.submitHandler} className={sendButtonClass}>
                                    <img src="/images/icon-send-32.png" />
                                </a>
                            )}


                            <div className="btn btn-fab btn-raised more-button"  onClick={() => this.onSetSound()}>

                                {this.props.isSound &&

                                <i className=" material-icons" style={{
                                    left: "25px",
                                    fontSize: "30px",
                                    color: 'green'
                                }}>volume_down</i>
                                }
                                {!this.props.isSound &&

                                <i className=" material-icons" style={{
                                    left: "25px",
                                    fontSize: "30px",
                                    color: 'black'
                                }}>volume_off</i>
                                }

                            </div>


                            <audio className="sound-clips" style={{display:"none"}}> </audio>
                        </div>
                    </fieldset>

                </form>
            );
        }
    }
}

ChatInput.defaultProps = {

};

export default ChatInput;