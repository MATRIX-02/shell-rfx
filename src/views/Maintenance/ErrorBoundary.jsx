// ErrorBoundary.jsx
import { useRouteError } from 'react-router-dom';
import Error404 from './Error404';
import Error500 from './Error500';
import GeneralError from './GeneralError';

const ErrorBoundary = () => {
  const error = useRouteError();
  console.log(error.stack)

  if (error?.status === 404) {
    return <Error404 />;
  }

  if (error?.status === 500) {
    return <Error500 />;
  }

  return <GeneralError errorMessage={error.message} errorDetails={error.stack}/>;
};

export default ErrorBoundary;
