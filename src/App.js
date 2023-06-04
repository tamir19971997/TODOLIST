import React, { useState, useEffect } from 'react';

const App = () => {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [quoteData, setQuoteData] = useState(null);
    const [imageArray, setImageArray] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const WEATHER_API_KEY = '9860a4a3b5213705a3c02482a181d663';
    const latitude = 32.9646; // Latitude of Tzfat
    const longitude = 35.4955; // Longitude of Tzfat
    const UNSPLASH_ACCESS_KEY = 'ufcgqsE1Ptq9Pu4xqTmyGOvfNELIsYaLq90JuakzxPk'; 

    const handleInputChange = (event) => {
        setTask(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (task.trim() !== '') {
            setTasks([...tasks, { name: task, completed: false }]);
            setTask('');
        }
    };

    const handleTaskDelete = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks.splice(index, 1);
        setTasks(updatedTasks);
    };

    const handleTaskToggle = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    };

    const fetchWeatherData = async () => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
            );
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.log('Error fetching weather data:', error);
        }
    };

    const fetchQuoteData = async () => {
        try {
            const response = await fetch('https://api.quotable.io/random');
            const data = await response.json();
            setQuoteData(data);
        } catch (error) {
            console.log('Error fetching quote data:', error);
        }
    };

    const fetchImageData = async () => {
        try {
            const response = await fetch(
                `https://api.unsplash.com/photos/random?query=inspirational&count=5&client_id=${UNSPLASH_ACCESS_KEY}`
            );
            const data = await response.json();
            setImageArray(data);
        } catch (error) {
            console.log('Error fetching image data:', error);
        }
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageArray.length) % imageArray.length);
    };

    useEffect(() => {
        fetchWeatherData();
        fetchQuoteData();
        fetchImageData();
    }, []);

    return (
        <div>
            <h1>To-Do List</h1>
            <form onSubmit={handleFormSubmit}>
                <input type="text" value={task} onChange={handleInputChange} />
                <button type="submit">Add Task</button>
            </form>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.name}</span>
                        <button onClick={() => handleTaskToggle(index)}>{task.completed ? 'Undo' : 'Complete'}</button>
                        <button onClick={() => handleTaskDelete(index)}>Delete</button>
                    </li>
                ))}
            </ul>
            {weatherData && weatherData.main && (
                <div>
                    <h2>Weather Data in Tzfat</h2>
                    <p>Temperature: {Math.round(weatherData.main.temp - 273.15)} C</p>
                    <p>Description: {weatherData.weather[0].description}</p>
                </div>
            )}
            {quoteData && (
                <div>
                    <h2>Random Quote</h2>
                    <p>"{quoteData.content}" - {quoteData.author}</p>
                </div>
            )}
            {imageArray.length > 0 && (
                <div>
                    <h2>Random Inspirational Image</h2>
                    <img src={imageArray[currentImageIndex].urls.small} alt={imageArray[currentImageIndex].alt_description} />
                    <div>
                        <button onClick={handlePrevImage}>Previous Image</button>
                        <button onClick={handleNextImage}>Next Image</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
