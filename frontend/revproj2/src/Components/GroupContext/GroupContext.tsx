import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** 
 * The backend endpoints (for reference):
 *  GET /groups                      => list groups
 *  POST /groups                     => create a new group
 *  POST /groups/{groupId}/join      => user joins group
 *  POST /groups/{groupId}/leave     => user leaves group
 *  GET /groups/{groupId}/events     => list group events
 *  POST /groups/{groupId}/events    => create group event
 * 
 * We'll store them in GroupContext and fetch userId from somewhere else (like the AuthContext).
 */

// A single group in our local state
export type Group = {
  id: number;
  name: string;
  // we can store a list of userIds, or not, depending on the data from server
  members?: number[];
  // you can store events if you want them in-line, or fetch them separately
};

export type GroupEvent = {
  id: number;
  day: string;        // "YYYY-MM-DD"
  title: string;
  description: string;
};

interface GroupContextType {
  groups: Group[];                             // all known groups
  myGroups: number[];                          // IDs of groups the user is in
  fetchGroups: () => Promise<void>;            // re-fetch the list of groups
  createGroup: (name: string) => Promise<void>;
  joinGroup: (groupId: number) => Promise<void>;
  leaveGroup: (groupId: number) => Promise<void>;

  // For group events
  fetchGroupEvents: (groupId: number) => Promise<GroupEvent[]>;
  createGroupEvent: (groupId: number, day: string, title: string, description: string) => Promise<void>;

  // Return all group events (across all groups user is in) for a day
  getAllGroupEventsForDay: (day: string, userId: number) => Promise<GroupEvent[]>;
}

/** Create the context with an empty default */
const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<number[]>([]); 
  // We'll keep track of the group IDs the user belongs to. 
  // (Alternatively, we might store that in the group objects themselves.)

  // We might fetch userId from your AuthContext or from localStorage:
  const userId = Number(localStorage.getItem('userId') || 0); 
  const navigate = useNavigate();

  /** 
   * 1) fetchGroups: calls GET /groups 
   *    response => setGroups(...) 
   */
  async function fetchGroups() {
    try {
      const token = localStorage.getItem('token') ? JSON.parse(String(localStorage.getItem('token'))) : null;
      const id = localStorage.getItem('id') ? JSON.parse(String(localStorage.getItem('id'))) : null;
  
      const res = await fetch(`http://localhost:8081/groups?userId=${id}`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) {
        throw new Error(`GET /groups failed: ${res.status}`);
      }
      const groupArray = await res.json();
  
      setGroups(groupArray.map((g: any) => ({
        id: g.id,
        name: g.name,
      })));
  
      setMyGroups(groupArray.filter((g: any) => g.isMember).map((g: any) => g.id));
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  }
  

  /** 
   * 2) createGroup: calls POST /groups 
   */
  async function createGroup(name: string) {
    try {
      const token = localStorage.getItem('token') ? JSON.parse(String(localStorage.getItem('token'))) : null;
      const res = await fetch('http://localhost:8081/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        throw new Error(`POST /groups failed: ${res.status}`);
      }
      // after creation, re-fetch to see the new group in our list
      await fetchGroups();
    } catch (err) {
      console.error('Error creating group:', err);
    }
  }

  /** 
   * 3) joinGroup: calls POST /groups/{groupId}/join 
   */
  async function joinGroup(groupId: number) {
    try {
      const token = localStorage.getItem('token') ? JSON.parse(String(localStorage.getItem('token'))) : null;
      const id = localStorage.getItem('id') ? JSON.parse(String(localStorage.getItem('id'))) : null;
      const res = await fetch(`http://localhost:8081/groups/${groupId}/join?userId=${id}`, {

        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error(`POST /groups/${groupId}/join failed: ${res.status}`);
      }
      // after success, update local state
      setMyGroups((prev) => [...prev, groupId]);
    } catch (err) {
      console.error('Error joining group:', err);
    }
  }

  /** 
   * 4) leaveGroup: calls POST /groups/{groupId}/leave 
   */
  async function leaveGroup(groupId: number) {
    try {
      const token = localStorage.getItem('token') ? JSON.parse(String(localStorage.getItem('token'))) : null;
      const id = localStorage.getItem('id') ? JSON.parse(String(localStorage.getItem('id'))) : null;
      const res = await fetch(`http://localhost:8081/groups/${groupId}/leave?userId=${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error(`POST /groups/${groupId}/leave failed: ${res.status}`);
      }
      // after success, remove from myGroups
      setMyGroups((prev) => prev.filter((gId) => gId !== groupId));
    } catch (err) {
      console.error('Error leaving group:', err);
    }
  }

  /** 
   * 5) fetchGroupEvents: GET /groups/{groupId}/events 
   *    returns an array of GroupEvent 
   */
  async function fetchGroupEvents(groupId: number): Promise<GroupEvent[]> {
    try {
      const token = localStorage.getItem('token') ? JSON.parse(String(localStorage.getItem('token'))) : null;
      const res = await fetch(`http://localhost:8081/groups/${groupId}/events`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) {
        throw new Error(`GET /groups/${groupId}/events failed: ${res.status}`);
      }
      const data: GroupEvent[] = await res.json();
      return data;
    } catch (err) {
      console.error('Error fetching group events:', err);
      return [];
    }
  }

  /**
   * 6) createGroupEvent: POST /groups/{groupId}/events
   */
  async function createGroupEvent(
    groupId: number,
    day: string,
    title: string,
    description: string
  ) {
    try {
      const token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token")!)
        : null;
  
      const userId = localStorage.getItem("id")
        ? JSON.parse(localStorage.getItem("id")!)
        : null;
  
      const isPersonalEvent = groupId === -1; // Personal events are identified by groupId = -1
  
      // Construct request body
      const bodyObject = isPersonalEvent
        ? { title, description, day, userId }
        : { title, description, day };
  
      // Safeguard: Remove any undefined or null properties
      Object.keys(bodyObject).forEach(
        (key) =>
          (bodyObject as any)[key] === undefined &&
          delete (bodyObject as any)[key]
      );
  
      const body = JSON.stringify(bodyObject);
      console.log("Request Body:", body); 

  
      // Log the endpoint and body for debugging
      const endpoint = isPersonalEvent
        ? `http://localhost:8081/personal-events`
        : `http://localhost:8081/groups/${groupId}/events`;
      console.log("Endpoint:", endpoint);
      console.log("Request Body:", body);
  
      // Send the request
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });
  
      if (!res.ok) {
        throw new Error(
          `POST ${
            isPersonalEvent ? "/personal-events" : `/groups/${groupId}/events`
          } failed: ${res.status}`
        );
      }
  
      const newEvent = await res.json();
      console.log("Created event:", newEvent);
    } catch (err) {
      console.error("Error creating event:", err);
    }
  }
  
  
  
  

  /**
   * 7) getAllGroupEventsForDay: merges events from all groups the user is in for a given day
   *    We'll call fetchGroupEvents for each group the user is in, then combine the results
   */
  async function getAllGroupEventsForDay(day: string, userId: number): Promise<GroupEvent[]> {
    const results: GroupEvent[] = [];
    for (let gId of myGroups) {
      try {
        const events = await fetchGroupEvents(gId);
        const filtered = events.filter(evt => evt.day === day);
        results.push(...filtered);
      } catch (err) {
        console.error('Error in getAllGroupEventsForDay for groupId=' + gId, err);
      }
    }
    return results;
  }

  // We'll fetch the list of groups once on mount
  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <GroupContext.Provider value={{
      groups,
      myGroups,
      fetchGroups,
      createGroup,
      joinGroup,
      leaveGroup,
      fetchGroupEvents,
      createGroupEvent,
      getAllGroupEventsForDay
    }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
}
