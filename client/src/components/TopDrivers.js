import React from "react";

const TopDrivers = ({ data }) => {
  return (
            <div className="card">
                   <h3>Top Offenders</h3>
                   <table className="table">
                                 <thead><tr><th>Driver ID</th>
                                            <th>Total Alerts</th>
                                        </tr>
                                 </thead>
                                 <tbody>
                                         {data.map((driver, index) => (
                                                           <tr key={index}>
                                                               <td>{driver._id}</td>
                                                               <td>{driver.count}</td>
                                                           </tr>
                                          ))}
                                   </tbody>
                     </table>
             </div>
   );
};

export default TopDrivers;

/* [{"_id": "D106","count": 3 },
    { "_id": "D103","count": 2}] */