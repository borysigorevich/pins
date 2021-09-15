import {useEffect, useState} from "react";
import ReactMapGl, {Marker, Popup} from 'react-map-gl'
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';
import './app.css'
import axios from "axios";
import {format} from 'timeago.js'
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";

function App() {
    const myStorage = window.localStorage
    const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'))
    const [pins, setPins] = useState([])
    const [currentPlaceId, setCurrentPlaceId] = useState(null)
    const [newPlace, setNewPlace] = useState(null)
    //form states
    const [title, setTitle] = useState(null)
    const [desc, setDesc] = useState(null)
    const [rating, setRating] = useState(0)
    const [showRegister, setShowRegister] = useState(false)
    const [showLogin, setShowLogin] = useState()

    const [viewport, setViewport] = useState({
        width: '100vw',
        height: '100vh',
        latitude: 49,
        longitude: 32,
        zoom: 4
    })

    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get('/pins')
                setPins(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getPins()
    }, [])

    const handleMarkerClick = (id, latitude, longitude) => {
        setCurrentPlaceId(id)
        setViewport(prev => {
            return {
                ...prev,
                latitude,
                longitude
            }
        })
    }

    const handleAddClick = (e) => {
        const [long, lat] = e.lngLat
        setNewPlace({
            lat,
            long
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newPin = {
            username: currentUser,
            title,
            desc,
            rating,
            lat: newPlace.lat,
            long: newPlace.long
        }
        try {
            const res = await axios.post('/pins', newPin)
            setPins([...pins, res.data])
            setNewPlace(null)
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogout = () => {
        myStorage.removeItem('user')
        setCurrentUser(null)
    }

    return (
        <div className="App">
            <ReactMapGl {...viewport}
                        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                        onViewportChange={nextViewport => setViewport(nextViewport)}
                        mapStyle={'mapbox://styles/borysigorevich/cktj3nqvi3zh317r4x89rhluq'}
                        onDblClick={handleAddClick}
                        transitionDuration={200}>
                {pins.map(pin => {
                    return <><Marker latitude={pin.lat}
                                     longitude={pin.long}
                                     offsetLeft={-20}
                                     offsetTop={-10}
                    >
                        <RoomIcon style={{
                            fontSize: viewport.zoom * 5,
                            color: pin.username === currentUser ? 'tomato' : 'slateblue'
                        }}
                                  onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}/>
                    </Marker>
                        {pin._id === currentPlaceId &&
                        <Popup
                            latitude={pin.lat}
                            longitude={pin.long}
                            closeButton={true}
                            closeOnClick={false}
                            anchor="left"
                            onClose={() => {
                                setCurrentPlaceId(null)
                            }
                            }>
                            <div className={'card'}>
                                <label>Place</label>
                                <h4 className={'place'}>{pin.title}</h4>
                                <label>Review</label>
                                <p className={'desc'}>{pin.desc}</p>
                                <label>Rating</label>
                                <div className={'stars'}>
                                    {Array(pin.rating).fill(<StarIcon className={'star'}/>)}
                                </div>
                                <label>Information</label>
                                <span className={'username'}>Created by <b>{pin.username}</b></span>
                                <span className={'date'}>{format(pin.createdAt)}</span>
                            </div>
                        </Popup>
                        }
                    </>
                })}
                {newPlace && (<Popup latitude={newPlace.lat}
                                     longitude={newPlace.long}
                                     closeButton={true}
                                     closeOnClick={false}
                                     anchor="left"
                                     onClose={() => {
                                         setNewPlace(null)
                                     }
                                     }>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <label>Title</label>
                            <input type="text"
                                   placeholder={'Input a title'}
                                   onChange={e => {
                                       setTitle(e.target.value)
                                   }}/>
                            <label>Review</label>
                            <textarea placeholder={'Say us something about this place.'}
                                      onChange={e => {
                                          setDesc(e.target.value)
                                      }}>
                            </textarea>
                            <label>Rating</label>
                            <select onChange={e => {
                                setRating(e.target.value)
                            }}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <button className={'submitButton'} type={'submit'}>Add Pin</button>
                        </form>
                    </div>
                </Popup>)}
                {currentUser
                    ? (<button className={'button logout'} onClick={handleLogout}>Log out</button>)
                    : (<div className={'buttons'}>
                        <button className={'button login'} onClick={() => setShowLogin(true)}>Login</button>
                        <button className={'button register'} onClick={() => setShowRegister(true)}>Register</button>
                    </div>)}
                {showRegister && <Register setShowRegister={setShowRegister}/>}
                {showLogin &&
                <Login setShowLogin={setShowLogin}
                       myStorage={myStorage}
                       setCurrentUser={setCurrentUser}/>}
            </ReactMapGl>
        </div>
    );
}

export default App;
