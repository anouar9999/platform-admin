const InfoCard = ({ icon, value, label }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-1 md:gap-4">
        {icon}
        <span className="text-sm md:text-xl font-valorant w-22 ">{value}</span>
      </div>
      <p className="text-xs font-mono md:text-sm text-gray-400 capitalize">{label}</p>
    </div>
  );
  export default InfoCard;