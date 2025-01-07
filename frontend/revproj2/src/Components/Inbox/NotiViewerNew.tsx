import React, { useState, useEffect, MouseEventHandler} from "react";
import { getUserByUsername, usernameifAuthorized, getTrackers } from "../../API/Axios";
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
	[key:string] : number[] | Date[];
    trackDate: Date[];
    burnedCal: number[];
    duration: number[];
    volume: number[];
    carb: number[];
    fat: number[];
    kal: number[];
    protein: number[];
    weight: number[];
    sleep: number[];
    water: number[];
};

const NotiViewerNew: React.FC<ViewerProp> = ({ userId, goalId, clicked }) => {
    const [trackers, setTrackers] = useState<any[]>([]);
    const [datavis, setDatavis] = useState<DataVis>({
        trackDate: [],
        burnedCal: [],
        duration: [],
        volume: [],
        carb: [],
        fat: [],
        kal: [],
        protein: [],
        weight: [],
        sleep: [],
        water: [],
    });

    useEffect(() => {
        // Ensure useEffect is only triggered once userId and goalId are valid
        if (userId !== 0 && goalId !== 0) {
          // Fetch or update data when userId and goalId change
          console.log('userId:', userId, 'goalId:', goalId);
          // Example: Fetch data based on userId and goalId
          const fetchData = async () => {
            let trackers = await getTrackers(userId, goalId);
	    
            setTrackers(trackers);
        };
        fetchData();
        }
      }, [userId, goalId]); // Add userId and goalId as dependencies

    useEffect(() => {
        if (trackers) {
            const newDatavis : DataVis = {
                trackDate: [],
                burnedCal: [],
                duration: [],
                volume: [],
                carb: [],
                fat: [],
                kal: [],
                protein: [],
                weight: [],
                sleep: [],
                water: [],
            };

            trackers.forEach((tracker: any) => {
                newDatavis.trackDate.push(tracker.createdAt);
                newDatavis.burnedCal.push(tracker.exercise.caloriesBurned);
                newDatavis.duration.push(tracker.exercise.duration);
                newDatavis.volume.push(tracker.exercise.volume);
                newDatavis.carb.push(tracker.nutrition.carb);
                newDatavis.fat.push(tracker.nutrition.fat);
                newDatavis.kal.push(tracker.nutrition.kal);
                newDatavis.protein.push(tracker.nutrition.protein);
                newDatavis.weight.push(tracker.nutrition.weight);
                newDatavis.sleep.push(tracker.sleep);
                newDatavis.water.push(tracker.water);
            });

            setDatavis(newDatavis);
        }
    }, [trackers]);

    const charts = datavis.trackDate.length
        ? Object.keys(datavis)
              .filter((key) => key !== "trackDate")
              .map((key) => {
                  const chartData = {
                      labels: datavis.trackDate,
                      datasets: [
                          {
                              label: key,
                              data: datavis[key] as number[],
                              fill: false,
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
                      <div key={key}>
                          <h3>{key}</h3>
                          <Line data={chartData} options={chartOptions} />
                      </div>
                  );
              })
        : null;

    return (
        <>
            	{trackers ? (clicked && <div>{charts}</div>) : (<p> Loading... </p>) }
	    	{trackers ? (clicked && <PostFeedSmart goalId = {goalId} userId = {userId} />) : (<p> Loading... </p>) }
	
        </>
    );
};

export default NotiViewerNew;
