const TabButton = ({ tab,activeTab,onTabChange }) => (
    <div className="relative inline-block px-1 md:px-2">
      <svg
        width="100"
        height="32"
        viewBox="0 0 100 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <path
          d="M6 0H87C90.5 0 93.5 1 95.5 3L100 7.5V27.5C100 30 98 32 95.5 32H13C9.5 32 6.5 31 4.5 29L0 24.5V4.5C0 2 2 0 4.5 0H6Z"
          fill={activeTab === tab ? '#ff3d08' : 'transparent'}
        />
      </svg>
      <button
        onClick={() => onTabChange(tab)}
        className={`absolute inset-0 flex items-center justify-center text-xs md:text-sm font-pilot 
          ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}
      >
        <span>{tab}</span>
      </button>
    </div>
  );
  export default TabButton;