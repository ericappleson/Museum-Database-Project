const AddIcon = () => {
  return(
    <div className="group cursor-pointer">
      <svg width="34" height="34" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect className="transition duration-[250ms] fill-white group-hover:fill-black" x="0.5" y="0.5" width="33" height="33" rx="7.5" stroke="black" /*style={{fill: "rgb(255, 255, 255)"}}*/ id="object-0"/>
        <mask id="mask0_64_1583" style={{mask:"alpha"}} maskUnits="userSpaceOnUse" x="5" y="5" width="24" height="24">
        <rect x="5" y="5" width="24" height="24" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask0_64_1583)">
        <path className="transition duration-[250ms] fill-black group-hover:fill-white" d="M16 18H10V16H16V10H18V16H24V18H18V24H16V18Z" /*fill="black"*//>
        </g>
      </svg> 
    </div>
  );
}

export default AddIcon