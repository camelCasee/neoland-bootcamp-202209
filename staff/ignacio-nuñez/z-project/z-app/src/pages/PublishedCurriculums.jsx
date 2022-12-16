import { useContext, useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { Context } from "../components/Context"
import retrievePublishedCurriculums from "../logic/retrievePublishedCurriculums"
import { format } from 'timeago.js'
import Button from "../components/Button"
import errorHandling from "../utils/errorHandling"
import SearchButton from "../components/SearchButton"

function PublishedCurriculums() {
    const [curriculums, setCurriculums] = useState([])

    const { user, showAlert } = useContext(Context)

    useEffect(() => {
        try {
            retrievePublishedCurriculums(sessionStorage.token)
                .then(curriculums => {
                    setCurriculums(curriculums)
                })
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }, [])

    const userName = user && user.name

    return <main className="min-h-screen bg-slate-100">
            <SearchButton/>
        <div className="flex items-center flex-col">
            <div className="flex items-center flex-col w-full mt-20">
                <section className="flex items-center w-full flex-col p-2">
                    {curriculums?.length ? curriculums.map(curriculum => {
                        return <article key={curriculum.id} className="flex flex-col gap-2 shadow-sm shadow-slate-600 bg-emerald-200 mt-3.5 border-2 w-full rounded-xl">
                            <div className="flex justify-between z-10 p-2 mt-1">
                                <h2 className='bg-emerald-200 p-2 border-2 font-semibold resize-none outline-none rounded-lg'>{curriculum.title}</h2>
                                <img className="w-1/5 text-xs p-2" src={curriculum.photo} alt="company logo" />
                            </div>
                            <div className='flex flex-col gap-2 bg-white p-2'>
                                <div className=' rounded-lg bg-emerald-50 p-2'>
                                    <div className='flex gap-6 justify-between'>
                                    </div>
                                    <div className='flex gap-1'>
                                        <span className="font-semibold">Location:</span>
                                        <span className="text-md w-1/2 text-gray-700 bg-transparent border-0 border-gray-200 capitalize">{curriculum?.location ? curriculum.location : 'Location'}</span>
                                    </div>
                                </div>
                                <div className='bg-slate-100 p-2 rounded-lg'>
                                    <h3 className='font-semibold'>Description:</h3>
                                    <p className='ml-1'>{curriculum?.description}</p>

                                </div>
                                <div className="rounded-lg bg-emerald-50 p-2">
                                    <h2 className='font-semibold'>Experiences:</h2>
                                    {!curriculum.experiences?.length ? <span>Not Experiences</span> :
                                        curriculum.experiences.map(experience => {
                                            return <div key={experience.id}>
                                                <h3>Position: {experience.position}</h3>
                                                <span>{experience.years} years of experience</span>
                                            </div>
                                        })}
                                </div>
                                <div>
                                    <div className="rounded-lg bg-slate-100 p-2">
                                        <h2 className='font-semibold'>Studies:</h2>
                                        {!curriculum.studies?.length ? <span>Not Studies</span> :
                                            curriculum.studies.map(study => {
                                                return <div key={study.id}>
                                                    <h3>{study.title}</h3>
                                                </div>
                                            })}
                                    </div>
                                </div>
                                <div className=" rounded-lg bg-emerald-50 p-2">
                                    <h2 className='font-semibold'>Knowledges:</h2>
                                    {!curriculum?.knowledges?.length ? <span> Not Knowledges </span> :
                                        <ul className="flex flex-wrap gap-2">
                                            {curriculum?.knowledges.map(knowledge => {
                                                return <li key={knowledge.id} className="max-w-[45%] text-sm flex border flex-col gap-1 rounded-xl p-1">
                                                    <span>{knowledge.title}</span>
                                                    <span>Level: <span className='capitalize'>{knowledge.level}</span></span>
                                                </li>
                                            })}
                                        </ul>
                                    }
                                </div>
                                <div className="rounded-lg bg-slate-100 p-2">
                                    <h2 className='font-semibold'>Languages:</h2>
                                    {!curriculum.languages?.length ? <span>Not Languages</span> :
                                        <div className="flex flex-wrap">
                                            {curriculum.languages.map(language => {
                                                return <div key={language.id} className="flex flex-col w-1/2">
                                                    <div>
                                                        <span>{language.language}: </span>
                                                        <span>{language.level}</span>
                                                    </div>
                                                </div>
                                            })}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className='z-10 flex justify-between gap-2 p-1 mb-2'>
                                <Button className="text-lg font-semibold bg-red-400 w-1/3">X</Button>
                                <p className="self-end text-sm p-1">{format(curriculum.createDate)}</p>
                                <Button className="text-lg font-semibold bg-green-400 w-1/3">Yes</Button>
                            </div>
                        </article>
                    }) : <div>
                        <h3>There is not published curriculums yet</h3>
                    </div>
                    }
                </section>
            </div>
        </div>
        <NavBar
        />
    </main>
}

export default PublishedCurriculums