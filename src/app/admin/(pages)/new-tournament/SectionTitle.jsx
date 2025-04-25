const SectionTitle = ({ title, icon: Icon, description }) => {
    return (
      <div className="flex py-4 angular-cut group">
        <div className="flex-1 pt-1">
          <h2 className="text-2xl font-valorant text-primary flex items-center group-hover:text-primary transition-colors duration-300">
            {title}
            <div className="h-0.5 flex-1 bg-gradient-to-r from-primary to-transparent ml-4 transform origin-left transition-all duration-500 group-hover:scale-x-105 group-hover:from-primary/60"></div>
          </h2>
        </div>
      </div>
    );
  };
  export default  SectionTitle;