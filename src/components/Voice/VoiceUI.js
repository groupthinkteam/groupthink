import React from "react";
import * as SWRTC from "@andyet/simplewebrtc";

const API_KEY = '120319f9263e8477a01064c0';
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;

// props:
// 1. userID
// 2. roomID
export default function VoiceUI(props) {
    return (
        <SWRTC.Provider configUrl={CONFIG_URL}>
            {/* Render based on the connection state */}
            <SWRTC.Connecting>
                <h1>Connecting...</h1>
            </SWRTC.Connecting>

            <SWRTC.Connected>
                <h1>Connected!</h1>
                {/* Request the user's media */}
                <SWRTC.RequestUserMedia audio video auto />

                {/* Enable playing remote audio. */}
                <SWRTC.RemoteAudioPlayer />

                {/* Connect to a room with a name and optional password */}
                <SWRTC.Room name={props.roomID}>
                </SWRTC.Room>
            </SWRTC.Connected>
        </SWRTC.Provider>
    )
}