import React, { useState } from 'react';
import { Provider } from 'react-redux';
import * as SWRTC from '@andyet/simplewebrtc';
import '../../styles/VoiceRoom.scss';

const API_KEY = '120319f9263e8477a01064c0';
const ROOM_NAME = "document_id";
const ROOM_PASSWORD = 'default';
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;
const store = SWRTC.createStore();

const RoomConnect = (props) => {
  const [isJoined, setIsJoined] = useState(false);
  return (
    <div className="voice-room">
      <Provider store={store}>
        <SWRTC.Provider configUrl={CONFIG_URL} displayName={props.currentUser.displayName}>
          <SWRTC.Connecting>
            <p>Connecting...</p>
          </SWRTC.Connecting>
          <SWRTC.Connected>
            {!isJoined ?
              <div className="join-leave-call" onClick={() => setIsJoined(!isJoined)}>
                <img alt="join call" src={require("../../assets/join-call-icon.svg")} />
              </div>
              :
              <div>
                <SWRTC.RequestUserMedia audio auto audioTypeHint="speech" />
                <SWRTC.RemoteAudioPlayer />
                <SWRTC.Room name={ROOM_NAME} password={ROOM_PASSWORD} >
                  {roomprops =>
                    <div className="joined-call">
                      <div className="join-leave-call" onClick={() => setIsJoined(!isJoined)}>
                        <img alt="end call" src={require("../../assets/end-call-icon.svg")} />
                      </div>
                      {roomprops.peers.map((peer) => <PeerItem peer={peer} />)}
                      <SWRTC.UserControls>
                        {userprops =>
                          <div className="mute-unmute" onClick={() => { userprops.isMuted ? userprops.unmute() : userprops.mute() }}>
                            {userprops.isMuted ? "Unmute" : "Click to Mute"}
                          </div>
                        }
                      </SWRTC.UserControls>
                    </div>
                  }
                </SWRTC.Room>
              </div>
            }
          </SWRTC.Connected>
          <SWRTC.Disconnected>
            Lost Connection
          </SWRTC.Disconnected>
        </SWRTC.Provider>
      </Provider>
    </div >
  )
}

function PeerItem(props) {
  return (
    <div className="peer-item" style={{ border: "2px solid black" }}>
      Peer Name: {props.peer.displayName} {props.peer.speaking ? "is speaking" : null}
    </div>
  )
}

export default RoomConnect;