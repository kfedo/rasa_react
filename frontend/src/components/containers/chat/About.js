import React from 'react';
import Modal from 'react-modal';

class About extends React.Component {
    componentDidMount() {
        // const main = document.getElementById('main');
        Modal.setAppElement(this.mm)
    }

    getUrlParam(name) {
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(name).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    constructor(props) {
        super(props);

        this.onCloseClick = this.onCloseClick.bind(this);
    }

    onCloseClick(event) {
        event.preventDefault();
        if(this.props.hide) {
            this.props.hide();
        }
    }

    render() {
        return (
            <div ref={mm=>this.mm = mm}>
                <Modal
                    isOpen={this.props.isOpen}
                    contentLabel="About Modal"
                    style={{content: {border: 'none', background: 'none', top: 20, left: 20, right: 20, bottom: 20, zIndex: 10}}}>

                    <div className="card feedback-container slideDown">
                        <form>
                            <fieldset>
                                <legend>Scarlet</legend>
                                The Next Generation (IPASE)
                                Internet Personal Assistance Search Engine

                                <h5>Privacy Policy</h5>
                                <ul>
                                    <li>Leader : Lonnie Cumberland, PhD</li>
                                    <li>Contact : Lonnie@outstep.com</li>
                                </ul>

                                <h5>External APIs</h5>
                                <ol>
                                    <li>SearX API</li>
                                    <li>Zomato API</li>

                                </ol>

                                <h5>General Libraries</h5>
                                <ol>
                                    <li>Rasa</li>
                                    <li>SocketIO</li>
                                    <li>WebRTC</li>
                                </ol>

                                <h5>Front Libraries/Frameworks</h5>
                                <ol>
                                    <li>React.js</li>
                                    <li>Twitter Bootstrap</li>
                                    <li>Bootstrap Material Design</li>
                                    <li>LESS</li>
                                </ol>
                                <h5>Backend Libraries/Frameworks</h5>
                                <ol>
                                    <li>SearX</li>
                                    <li>Docker</li>
                                    <li>NodeJS</li>
                                </ol>

                                <div className="form-group">
                                    <button onClick={this.onCloseClick} className="btn btn-raised btn-primary">Close</button>
                                </div>
                            </fieldset>

                        </form>
                    </div>
                </Modal>
            </div>
        )
    }
}

About.defaultProps = {

};
export default About;