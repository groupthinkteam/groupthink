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
    <div className="">
      <Provider store={store}>
        <SWRTC.Provider configUrl={CONFIG_URL} displayName={props.currentUser.displayName}>
          <SWRTC.Connecting>
            <p>Connecting...</p>
          </SWRTC.Connecting>
          <SWRTC.Connected>
            <button className={(isJoined ? "room-connect disconnect" : "room-connect connect")}
              onClick={() => setIsJoined(!isJoined)}>
              {isJoined ? "Leave" : "Join"}
            </button>
            {isJoined ?
              <div>
                <SWRTC.RequestUserMedia audio auto audioTypeHint="speech" />
                <SWRTC.RemoteAudioPlayer />
                <SWRTC.Room name={ROOM_NAME} password={ROOM_PASSWORD} >
                  {roomprops =>
                    <div>
                      {roomprops.peers.map((peer) => <PeerItem peer={peer} />)}
                      <SWRTC.UserControls>
                        {userprops =>
                          <button onClick={() => { userprops.isMuted ? userprops.unmute() : userprops.mute() }}>
                            {userprops.isMuted ? "Click to Unmute" : "Click to Mute"}
                          </button>
                        }
                      </SWRTC.UserControls>
                    </div>
                  }
                </SWRTC.Room>
              </div>
              : null
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