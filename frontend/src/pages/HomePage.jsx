import MemeGallery from "../components/MemeGallery";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
    return (
        <div className="main-layout" style={{display: 'flex'}}>
            <Sidebar/>
            <div style={{marginLeft: '50px', width: '100%'}}>
                <MemeGallery/>
            </div>
        </div>
    );
};

export default HomePage;