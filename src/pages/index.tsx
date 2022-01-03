import React from 'react';
import TokenFactoryForm from 'components/TokenFactoryForm/TokenFactoryForm';

const Home: React.FunctionComponent = () => {
  return (
    <div className="flex items-center justify-center px-6 py-10 max-w-screen">
      <TokenFactoryForm />
    </div>
  );
};

export default Home;
