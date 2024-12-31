import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProgressPage() {
  const { dayId } = useParams(); // Get the dayId from the URL
  const navigate = useNavigate();

  // User and goal state
  const [userId, setUserId] = useState<number | null>(null);
  const [goalId, setGoalId] = useState<number | null>(null);

  // Tracker state and loading/error flags
  const [tracker, setTracker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Token and username state
  const [userToken, setToken] = useState<string | null>(null);
  const [userName, setName] = useState<string | null>(null);

  // Fetch token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(JSON.parse(token));
    } else {
      setError('No token found. Please log in.');
      setLoading(false);
    }
  }, []);

  // Fetch username when token is available
  useEffect(() => {
    if (userToken) {
      const fetchUsername = async () => {
        try {
          const meRes = await fetch('http://localhost:8080/me', {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          if (!meRes.ok) {
            throw new Error(`GET /me failed: ${meRes.status}`);
          }
          const username = await meRes.text();
          setName(username);
        } catch (err) {
          setError('Failed to fetch username.');
          setLoading(false);
        }
      };

      fetchUsername();
    }
  }, [userToken]);

  // Fetch userId when username is available
  useEffect(() => {
    if (userName) {
      const fetchUserId = async () => {
        try {
          const userRes = await fetch(`http://localhost:8080/username/${userName}`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          if (!userRes.ok) {
            throw new Error(`GET /username/${userName} failed: ${userRes.status}`);
          }
          const userObj = await userRes.json();
          setUserId(userObj.id);
        } catch (err) {
          setError('Failed to fetch user ID.');
          setLoading(false);
        }
      };

      fetchUserId();
    }
  }, [userName, userToken]);

  // Fetch goalId when userId is available
  useEffect(() => {
    if (userId) {
      const fetchGoalId = async () => {
        try {
          const goalRes = await fetch(`http://localhost:8080/goalUser/${userId}`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          if (!goalRes.ok) {
            throw new Error(`GET /goalUser/${userId} failed: ${goalRes.status}`);
          }
          const goalObj = await goalRes.json();
          setGoalId(goalObj.id);
        } catch (err) {
          setError('Failed to fetch goal ID.');
          setLoading(false);
        }
      };

      fetchGoalId();
    }
  }, [userId, userToken]);

  // Fetch tracker data when goalId is available
  useEffect(() => {
    if (goalId) {
      const fetchTracker = async () => {
        try {
          const trackerRes = await fetch(`http://localhost:8080/Tracker/${userId}/${goalId}`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          if (!trackerRes.ok) {
            throw new Error(`GET /Tracker/${userId}/${goalId} failed: ${trackerRes.status}`);
          }
          const trackers = await trackerRes.json();
          const matched = trackers.find((t: any) => {
            const exDate = t.exercise?.exerciseDate;
            const slDate = t.sleepDate;
            const wtDate = t.waterDate;
            const nuDate = t.nutrition?.nutritionDate;
            return exDate === dayId || slDate === dayId || wtDate === dayId || nuDate === dayId;
          });

          setTracker(matched || null);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch tracker data.');
          setLoading(false);
        }
      };

      fetchTracker();
    }
  }, [goalId, userId, userToken, dayId]);

  // Navigation handler
  const goBack = () => {
    navigate('/calendar');
  };

  // Render loading, error, or tracker data
  if (loading) {
    return <div>Loading progress for {dayId}...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={goBack}>Back to Calendar</button>
      </div>
    );
  }

  if (!tracker) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Progress for {dayId}</h2>
        <p>No tracker found for this date.</p>
        <button onClick={goBack}>Back to Calendar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Progress for {dayId}</h2>
      <p><strong>Calories Burned:</strong> {tracker.exercise?.caloriesBurned || 0}</p>
      <p><strong>Volume (weight*reps*sets):</strong> {tracker.exercise?.volume || 0}</p>
      <p><strong>Time:</strong> {tracker.exercise?.duration || 0} min</p>

      <p><strong>Sleep (hrs):</strong> {tracker.sleep || 0}</p>
      <p><strong>Water (oz):</strong> {tracker.water || 0}</p>
      <p><strong>Weight (lbs):</strong> {tracker.nutrition?.weight || 0}</p>

      <p><strong>Food Calories:</strong> {tracker.nutrition?.kal || 0} kcal</p>
      <p><strong>Carbs:</strong> {tracker.nutrition?.carb || 0} g</p>
      <p><strong>Fat:</strong> {tracker.nutrition?.fat || 0} g</p>
      <p><strong>Protein:</strong> {tracker.nutrition?.protein || 0} g</p>

      <button onClick={goBack}>Back to Calendar</button>
    </div>
  );
}

export default ProgressPage;
