import React, { useState } from 'react';
import { Provider } from 'react-redux';
import * as SWRTC from '@andyet/simplewebrtc';
const API_KEY = 'INSERT API KEY';
const ROOM_NAME = "document_id";
const ROOM_PASSWORD = 'defauly';
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;
const store = SWRTC.createStore();

function RoomConnect(props) {
    const [isJoined, setIsJoined] = useState(false)
    return (
      <div>
        <Provider store={store}>
          <SWRTC.Provider configUrl={CONFIG_URL} displayName="Chinmay">
            <SWRTC.Connecting>
              <h1>Connecting...</h1>
            </SWRTC.Connecting>
  
            <SWRTC.Connected>
              <button onClick={() => setIsJoined(!isJoined)}>
                {isJoined ? "Leave" : "Join"}
              </button>
  
              <h1>Connected!</h1>
              <SWRTC.RequestUserMedia audio auto />
              <SWRTC.RemoteAudioPlayer />
              {isJoined ?
                <SWRTC.Room name={ROOM_NAME} password={ROOM_PASSWORD} >
                  {roomprops =>
                    <div>
                      
                      {roomprops.peers.map(
                        (peer) => <PeerItem peer={peer} />
                      )
                      }
                      <SWRTC.UserControls>
                        {userprops =>
                          <button onClick={() => userprops.isMuted ? userprops.unmute() : userprops.mute()}>
                            {userprops.isMuted ? "Unmute" : "Mute"}
                          </button>
                        }
                      </SWRTC.UserControls>
                    </div>
                  }
                </SWRTC.Room>
                : null}
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