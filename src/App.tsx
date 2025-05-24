import React from 'react';
import './App.css';
import Layout from '@/components/layout/Layout';
import SubscribersDashboard from '@/pages/subscribers-dashboard/SubscribersDashboard';


const App: React.FC = () => {
  return (
    <Layout>
      <SubscribersDashboard />
    </Layout>
  );
};

export default App;