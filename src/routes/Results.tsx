import { useLocation } from 'react-router-dom';


export function Results() {
  const location = useLocation();
  console.log(location)

  return (<p>hello world</p>)
}
