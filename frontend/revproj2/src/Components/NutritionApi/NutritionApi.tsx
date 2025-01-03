import React from 'react'

function NutritionApi() {
    function handleApiCall(){
        const query = "mac and cheese";
        const fetchApiData = async () =>{
        const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${query}`,{
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': 'gg1FPG2C5LRmeHth7W78aQ==AzZg9ImEsiX2oEbc'
            }
        });

        const data = await response.json();
        console.log("Here is the data returned from nutrition API: ", data);
        console.log("Here is the items object of data returned which is an array getting only calories: ", data.items[0].calories);
    }
    fetchApiData();

    }
    
  return (
    <div>NutritionApi<br/>
        <button onClick={handleApiCall}>Call Api</button>
    </div>
  )
}

export default NutritionApi