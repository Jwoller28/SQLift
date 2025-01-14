import React, { useState, useEffect } from "react";
import { getTrackers } from "../../API/Axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import PostFeedSmart from "../PostFeed/PostFeedSmart";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ViewerProp {
  goalId: number;
  userId: number;
  clicked: boolean;
}

interface DataVis {
  [key: string]: number[] | Date[];
  trackDate: Date[];
  CaloriesBurned: number[];
  Duration: number[];
  Volume: number[];
  Carbs: number[];
  Fat: number[];
  CaloriesConsumed: number[];
  Protein: number[];
  WeightLost: number[];
  Sleep: number[];
  Water: number[];
}

const NotiViewerNew: React.FC<ViewerProp> = ({ userId, goalId, clicked }) => {
  const [trackers, setTrackers] = useState<any[]>([]);
  const [datavis, setDatavis] = useState<DataVis>({
    trackDate: [],
    CaloriesConsumed: [],
    Carbs: [],
    Fat: [],
    Protein: [],
    WeightLost: [],
    CaloriesBurned: [],
    Duration: [],
    Volume: [],
    Water: [],
    Sleep: [],
  });

  useEffect(() => {
    if (userId !== 0 && goalId !== 0) {
      const fetchData = async () => {
        try {
          const fetchedTrackers = await getTrackers(userId, goalId);
          setTrackers(fetchedTrackers || []);
        } catch (error) {
          console.error("Error fetching trackers:", error);
        }
      };
      fetchData();
    }
  }, [userId, goalId]);

  useEffect(() => {
    if (trackers && trackers.length > 0) {
      const newDatavis: DataVis = {
        trackDate: [],
        CaloriesConsumed: [],
        Carbs: [],
        Fat: [],
        Protein: [],
        WeightLost: [],
        CaloriesBurned: [],
        Duration: [],
        Volume: [],
        Water: [],
        Sleep: [],
      };

      trackers.forEach((tracker: any) => {
        newDatavis.trackDate.push(tracker.createdAt || new Date());
        newDatavis.CaloriesConsumed.push(tracker.nutrition?.kal || 0);
        newDatavis.Carbs.push(tracker.nutrition?.carb || 0);
        newDatavis.Fat.push(tracker.nutrition?.fat || 0);
        newDatavis.Protein.push(tracker.nutrition?.protein || 0);
        newDatavis.WeightLost.push(tracker.nutrition?.weight || 0);
        newDatavis.CaloriesBurned.push(tracker.exercise?.caloriesBurned || 0);
        newDatavis.Duration.push(tracker.exercise?.duration || 0);
        newDatavis.Volume.push(tracker.exercise?.volume || 0);
        newDatavis.Water.push(tracker.water || 0);
        newDatavis.Sleep.push(tracker.sleep || 0);
      });

      setDatavis(newDatavis);
    }
  }, [trackers]);

  const charts = datavis.trackDate.length
    ? Object.keys(datavis)
        .filter((key) => key !== "trackDate")
        .map((key) => {
          const chartData = {
            labels: datavis.trackDate.map((date) =>
              new Date(date).toLocaleDateString()
            ),
            datasets: [
              {
                label: key,
                data: datavis[key] as number[],
                fill: false,
                backgroundColor: "#504dff",
                borderColor: "#504dff",
              },
            ],
          };
          const chartOptions = {
            responsive: true,
            scales: {
              x: { type: "category" as const },
              y: { type: "linear" as const },
            },
          };
          return (
            <div
              style={{
                padding: "20px",
                marginBottom: "30px",
                background: "linear-gradient(to bottom, #2F2F2F, #1A1A1A)",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
                maxWidth: "750px", 
                margin: "0 auto", 
                color: "#ffffff", 
                textAlign: "center",
              }}
            >
              <h2 style={{ marginBottom: "10px", fontWeight: "bold", color: "#ff6bcb" }}>
                {key}
              </h2>
              <div
                key={key}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  maxWidth: "700px", 
                  minWidth: "700px", 
                  margin: "0 auto",
                }}
              >
                <h3 style={{ textAlign: "center", marginBottom: "10px", color: "#333" }}>
                </h3>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          );

        })
    : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        background: "linear-gradient(135deg, #ff6bcb, #504dff)",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {clicked && trackers.length > 0 && charts}
      
      {trackers.length === 0 && <p>Loading...</p>}
    </div>
  );
};

export default NotiViewerNew;
