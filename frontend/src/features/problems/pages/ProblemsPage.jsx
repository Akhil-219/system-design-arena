import React, { useEffect, useState } from 'react'
import { getProblems } from '../services/problemService'
import ProblemCard from '../components/ProblemCard'

function ProblemsPage() {
  const [problems, setProblems]= useState([])
  const [pagination, setPagination]= useState(null)
  const [loading, setLoading]= useState(true)
  const [error , setError]=useState("")

  useEffect(()=>{
    const fetchProblems= async ()=>{
      setError("")
      try {
        const data = await getProblems()
        setProblems(data.problems)
        setPagination(data.pagination)
        
      } catch (error) {
        setError(error.message)
      }
      finally{
        setLoading(false)
      }
    }
    fetchProblems();
  },[])

  if(loading){
    return <p>Loading, PLease wait</p>
  }
  if(error){
    return <p>{error}</p>
  }
  if(problems.length === 0){
    return <p>No problems found</p>
  }
  return (
    <>
      {problems.map((problem)=>(
        <ProblemCard key={problem._id} problem={problem}/>
      ))}
    </>
  )
}

export default ProblemsPage