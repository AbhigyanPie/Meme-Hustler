import MemeForm from '../components/MemeForm';
import Sidebar from '../components/Sidebar';

const MemeFormPage = () => {
  return (
    <div>
      <Sidebar />
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}>
        <MemeForm />
      </div>
    </div>
  );
};

export default MemeFormPage;
