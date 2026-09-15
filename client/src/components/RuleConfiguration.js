import React from "react";

const RuleConfig = ({ rules }) => {
      return (
                       <div className="card">
                              <h3>Active Rule Configuration</h3> 
                              {Object.entries(rules).map(([type, config]) => (
                                                 <div key={type} style={{ marginBottom: "15px" }}>
                                                         <h4 style={{ marginBottom: "5px" }}>{type}</h4>
                                                         <ul>
                                                               {config.escalate_if_count && (                                                                          <li>Escalate if count ≥ {config.escalate_if_count}</li>
                                                               )}

                                                               {config.window_mins && (                                                                          <li>Window (mins): {config.window_mins}</li>
                                                               )}

                                                               {config.expire_after_mins && (                                                                  <li>Auto-close after: {config.expire_after_mins} mins</li>
                                                               )}

                                                               {config.auto_close_if && (                                                                          <li>Auto-close condition: {config.auto_close_if} = true</li>
                                                               )}

                                                        </ul>
                                                </div>
                               ))} 
                       </div>
       );
};

export default RuleConfig;
/*
  {  "overspeed" :  {"escalate_if_count": 3,"window_mins": 60,"expire_after_mins": 1440},
     "feedback_negative": {"escalate_if_count": 2,"window_mins": 1440,"expire_after_mins": 2880},
     "compliance":  {"auto_close_if": "document_valid","expire_after_mins": 1440 }
  }
*/