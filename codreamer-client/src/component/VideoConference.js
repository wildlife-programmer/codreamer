import { useState, useEffect, useRef } from 'react'
import GroupsIcon from '@mui/icons-material/Groups'
import CancelIcon from '@mui/icons-material/Cancel'
const VideoConference = ({ app }) => {
  const pc_config = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  }
  const peer_config = {
    video: true,
    audio: false,
  }
  const [pc, setpc] = useState()
  const localVideo = useRef()
  const [open, setOpen] = useState(false)
  const [mediaType, setMediaType] = useState('video')

  const sendOffer = (sessionDescription) => {
    pc.setLocalDescription(sessionDescription)
    app.fire('rtc_send_offer', sessionDescription)
  }
  const sendAnswer = () => {
    console.log('create answer')
    pc.createAnswer().then(sendOffer, handleSessionDescriptionError)
  }
  const handleError = (err) => {
    console.log('create offer error', err)
  }
  const handleSessionDescriptionError = (err) => {
    console.log('session description error', err)
  }

  const tryConnect = async () => {
    console.log(pc)
    if (mediaType === 'video') {
      await navigator.mediaDevices.getUserMedia(peer_config).then((stream) => {
        localVideo.current.srcObject = stream
        // pc.createOffer(sendOffer, handleError)
        // pc.addStream
        //   ? pc.addStream(stream)
        //   : stream.getTracks().forEach((track) => pc.addTrack(track, stream))
        // pc.addStream(stream)
      })
    } else {
      await navigator.mediaDevices
        .getDisplayMedia(peer_config)
        .then((stream) => {
          localVideo.current.srcObject = stream
          // stream.getTracks().forEach((track) => pc.addTrack(track, stream))
          pc.addStream
            ? pc.addStream(stream)
            : stream.getTracks().forEach((track) => pc.addTrack(track, stream))
        })
    }
  }
  const onReceiveOffer = (data) => {
    console.log('receive offer', pc, data)
    pc.setRemoteDescription(new RTCSessionDescription(data))
    sendAnswer()
  }

  const onReceiveAnswer = (data) => {
    pc.setRemoteDescription(new RTCSessionDescription(data))
  }

  const handleIceCandidate = (ev) => {
    console.log('ice candidate', ev)
    if (ev.candidate) {
    }
  }
  const handleRemoteStreamAdded = (ev) => {
    console.log('remote stream added')
    const remoteStream = ev.stream
    console.log('remote stream', remoteStream)
  }
  const handleRemoteStreamRemoved = (ev) => {
    console.log('remote stream removed', ev)
  }
  useEffect(() => {
    const newPC = new RTCPeerConnection(pc_config)
    console.log(newPC)
    newPC.onicecandidate = handleIceCandidate
    newPC.onaddstream = handleRemoteStreamAdded
    newPC.ontrack = (e) => console.log('ontrack', e)
    newPC.onremovestream = handleRemoteStreamRemoved
    setpc(newPC)
  }, [])

  useEffect(() => {
    if (pc) {
      app.on('rtc_receive_offer', onReceiveOffer)
      app.on('rtc_receive_answer', onReceiveAnswer)
      return () => {
        app.off('rtc_receive_offer', onReceiveOffer)
        app.off('rtc_receive_answer', onReceiveAnswer)
      }
    }
  }, [pc])

  return (
    <>
      {!open && (
        <GroupsIcon
          onClick={() => {
            !open && setOpen(true)
          }}
          className="group_icon"
        />
      )}
      <div className={open ? 'group_on' : 'group_off'}>
        <video width="100%" ref={localVideo} autoPlay playsInline></video>
        <div>
          <button onClick={tryConnect}>연결</button>
        </div>
        {open && (
          <CancelIcon className="group_close" onClick={() => setOpen(false)} />
        )}
      </div>
    </>
  )
}

export default VideoConference
