import React, { useState } from 'react';

const FilterSearched = () => {
  const [charge, setCharge] = useState(500);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [experience, setExperience] = useState(1);

  return (
    <div className='bg-white shadow-lg border-2 rounded-2xl border-gray-300 w-4/12 py-6 px-6'>
      <h3 className='text-3xl font-bold text-gray-700'>Filter Search</h3>
      <p className='text-sm font-semibold text-gray-600'>Filter the searched doctor & Get better result</p>
      
      <div className='w-full bg-gray-300 h-0.5 mt-6 mb-6'></div>

      {/* Consulting Charge Slider */}
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>Consulting Charge</label>
        <input 
          type='range' 
          min='100' 
          max='20000' 
          step='50' 
          value={charge} 
          onChange={(e) => setCharge(e.target.value)}
          className='w-full accent-orange-600 '
        />
        <p className='font-semibold text-lg text-gray-600 mt-1'>₹{charge}</p>
      </div>
      
      <div className='w-full bg-gray-300 h-0.5 mb-4'></div>

      {/* City Dropdown */}
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700mb-2'>District</label>
        <select 
          className='w-full p-3 border  rounded-lg border-gray-300 focus:ring-2  focus:ring-orange-600 focus:outline-none' 
          value={city} 
          onChange={(e) => setCity(e.target.value)}
        >
          <option value=''>Select City</option>
          <option value='Delhi'>Delhi</option>
          <option value='Mumbai'>Mumbai</option>
          <option value='Bangalore'>Bangalore</option>
        </select>
      </div>
      <div className='w-full bg-gray-300 h-0.5 mb-4'></div>
      
      {/* State Radio Buttons */}
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>Province</label>
        <div className='flex gap-4'>
          <label className='flex items-center gap-2 text-gray-700'>
            <input type='radio' name='state' value='Karnataka' onChange={(e) => setState(e.target.value)} className='accent-orange-600'/> Koshi
          </label>
          <label className='flex items-center gap-2 text-gray-700'>
            <input type='radio' name='state' value='Maharashtra' onChange={(e) => setState(e.target.value)} className='accent-orange-600'/> Madesh
          </label>
          <label className='flex items-center gap-2 text-gray-700'>
            <input type='radio' name='state' value='Delhi' onChange={(e) => setState(e.target.value)} className='accent-orange-600'/> Bagmati
          </label>
        </div>
      </div>
      <div className='w-full bg-gray-300 h-0.5 mb-4'></div>
      
      {/* Experience Range */}
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>Experience (Years)</label>
        <input 
          type='number' 
          min='1' 
          max='50' 
          value={experience} 
          onChange={(e) => setExperience(e.target.value)}
          className='w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-600 focus:outline-none'
        />
      </div>

      <button className='bg-orange-600 w-full rounded-md text-white font-semibold text-md py-3 text-center p-2'>Apply Filter</button>
    </div>
  );
};

export default FilterSearched;
