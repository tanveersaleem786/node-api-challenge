import React,{useEffect,useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";



function App() {
 
  const[projects,setProjects] = useState([]);
  useEffect(() => {
   
    const getProjects = () => {
      axios
        .get('http://localhost:9090/api/projects/')
        .then(response => {
          setProjects(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.log('Server Error', error);
        });
    }    
    getProjects();
  },[]);

  return (
    <div className="App">
      <header className="App-header">
      <h2>Client App For Projects</h2>
        <table>
          <tr>
            <th>Project ID</th>
            <th>Name</th>
            <th>Description</th>                  
          </tr> 
          {projects.map(project => (  
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.description}</td>                            
            </tr>
          ))}
        </table>    
        {console.log(projects)}
      </header>
    </div>
  );
}

export default App;
