import React from 'react'
import LeftSection from './../../../component/leftSection/leftSection';
import MainSection from './../../../component/mainSection/mainSection';
import RighteSection from './../../../component/righteSection/righteSection';

const Home = () => {
  return (
    <div className='w-full'>
      <div className='w-[80%] mx-auto bg-[#131621] text-white'>
      <div className='flex gap-4'>
    {/* left section */}
    <div className='w-[20%] bg-amber-400 '>
      <LeftSection />
    </div>

{/* main section */}
<div className='w-[60%] bg-amber-950 '>
  <MainSection />
</div>

{/* rightSection */}
<div className='w-[20%] bg-amber-100'>
  <RighteSection />
</div>

      </div>
      </div>
    </div>
  );
} 

export default Home;
