import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EditCourt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState({
    name: "",
    location: "",
    pricePerHour: "",
    availability: "",
  });

  // court data fetch
  useEffect(() => {
    fetch(`http://localhost:5000/api/courts/${id}`)
      .then(res => res.json())
      .then(data => setCourt(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setCourt({ ...court, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/api/courts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(court),
    });
    navigate("/owner-courts"); // list page pe wapis bhej do
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl">
      <h2 className="text-xl text-white font-bold mb-4">Edit Court</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={court.name}
          onChange={handleChange}
          placeholder="Court Name"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          name="location"
          value={court.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          name="pricePerHour"
          type="number"
          value={court.pricePerHour}
          onChange={handleChange}
          placeholder="Price Per Hour"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          name="availability"
          value={court.availability}
          onChange={handleChange}
          placeholder="Availability"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Update Court
        </Button>
      </form>
    </div>
  );
};

export default EditCourt;
