
import { auth } from "@/auth"
import { SignIn } from "@/components/sign-in"
import { BadgeCheck, Shield, Zap, Star } from "lucide-react"

async function getBadgeStatus(token: string) {
  // Query GitHub GraphQL API
  const query = `
    query {
      viewer {
        login
        avatarUrl
        pullRequests(first: 100, states: MERGED) {
          totalCount
        }
        issues(first: 100) {
          totalCount
        }
        repositories(first: 100, privacy: PUBLIC) {
            nodes {
                stargazerCount
            }
        }
        repositoryDiscussionComments(first: 100) {
            nodes {
                isAnswer
            }
        }
      }
    }
  `

  try {
    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        next: { revalidate: 60 } // Cache for 60s
    })
    
    const data = await res.json()
    if (data.errors) {
        console.error("GraphQL Errors:", data.errors)
        return null
    }
    return data.data.viewer
  } catch (e) {
    console.error("Fetch error:", e)
    return null
  }
}

export default async function Home() {
  const session = await auth()

  // @ts-expect-error - accessToken is added in auth.ts
  const token = session?.accessToken

  if (!session || !token) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-24 relative overflow-hidden">
         <div className="absolute inset-0 z-0">
             <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[120px]" />
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[120px]" />
         </div>
         
         <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-2xl">
            <div className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <Shield className="w-16 h-16 text-purple-400" />
            </div>
            <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                Badge Scanner
            </h1>
            <p className="text-xl text-gray-400">
                Connect your GitHub account to verify your achievements and discover what&apos;s missing from your collection.
            </p>
            <SignIn />
         </div>
      </main>
    )
  }

  const data = await getBadgeStatus(token)
  
  if (!data) return <div className="text-white p-20">Failed to load data. API Error.</div>

  const pullSharkCount = data.pullRequests.totalCount
  const hasPullShark = pullSharkCount >= 2
  // Unused variable removed: pullSharkTier

  // @ts-expect-error - API response type
  const answerCount = data.repositoryDiscussionComments.nodes.filter((n) => n.isAnswer).length
  const hasGalaxyBrain = answerCount >= 2
  
  const repos = data.repositories.nodes
  // @ts-expect-error - API response type
  const maxStars = Math.max(...repos.map(r => r.stargazerCount), 0)
  const hasStarstruck = maxStars >= 16
  const starsNeeded = 16 - maxStars

  return (
    <main className="min-h-screen bg-black text-white p-8 relative">
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-purple-500" />
                    <div>
                        <h2 className="text-2xl font-bold">{data.login}</h2>
                        <span className="text-gray-400 text-sm">Badge Hunter</span>
                    </div>
                </div>
                <form action={async () => {
                    "use server"
                    await import("@/auth").then(m => m.signOut())
                }}>
                    <button className="text-sm text-red-400 hover:text-red-300 transition-colors">Sign Out</button>
                </form>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pull Shark */}
                <div className={`p-6 rounded-2xl border ${hasPullShark ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gray-900/50 border-gray-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <BadgeCheck className={`w-10 h-10 ${hasPullShark ? 'text-blue-400' : 'text-gray-600'}`} />
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${hasPullShark ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-500'}`}>
                            {hasPullShark ? 'UNLOCKED' : 'LOCKED'}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Pull Shark</h3>
                    <p className="text-gray-400 text-sm mb-4">Merge 2 pull requests.</p>
                    <div className="space-y-2">
                         <div className="flex justify-between text-xs">
                             <span>Progress</span>
                             <span>{pullSharkCount} / 2 PRs</span>
                         </div>
                         <div className="w-full bg-gray-800 rounded-full h-2">
                             <div 
                                className="bg-blue-500 h-2 rounded-full transition-all" 
                                style={{width: `${Math.min((pullSharkCount / 2) * 100, 100)}%`}}
                             />
                         </div>
                         {hasPullShark && (
                            <div className="text-xs text-blue-300 pt-2">
                                Next Tier (Bronze): {pullSharkCount}/16 ({16 - pullSharkCount} needed)
                            </div>
                         )}
                    </div>
                </div>

                {/* Galaxy Brain */}
                <div className={`p-6 rounded-2xl border ${hasGalaxyBrain ? 'bg-purple-900/20 border-purple-500/50' : 'bg-gray-900/50 border-gray-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <Zap className={`w-10 h-10 ${hasGalaxyBrain ? 'text-purple-400' : 'text-gray-600'}`} />
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${hasGalaxyBrain ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-500'}`}>
                            {hasGalaxyBrain ? 'UNLOCKED' : 'LOCKED'}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Galaxy Brain</h3>
                    <p className="text-gray-400 text-sm mb-4">Get 2 accepted answers.</p>
                     <div className="space-y-2">
                         <div className="flex justify-between text-xs">
                             <span>Progress</span>
                             <span>{answerCount} / 2 Answers</span>
                         </div>
                         <div className="w-full bg-gray-800 rounded-full h-2">
                             <div 
                                className="bg-purple-500 h-2 rounded-full transition-all" 
                                style={{width: `${Math.min((answerCount / 2) * 100, 100)}%`}}
                             />
                         </div>
                    </div>
                </div>

                 {/* Starstruck */}
                <div className={`p-6 rounded-2xl border ${hasStarstruck ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-gray-900/50 border-gray-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <Star className={`w-10 h-10 ${hasStarstruck ? 'text-yellow-400' : 'text-gray-600'}`} />
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${hasStarstruck ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-800 text-gray-500'}`}>
                            {hasStarstruck ? 'UNLOCKED' : 'LOCKED'}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Starstruck</h3>
                    <p className="text-gray-400 text-sm mb-4">Create a repo with 16 stars.</p>
                     <div className="space-y-2">
                         <div className="flex justify-between text-xs">
                             <span>Best Repo</span>
                             <span>{maxStars} / 16 Stars</span>
                         </div>
                         <div className="w-full bg-gray-800 rounded-full h-2">
                             <div 
                                className="bg-yellow-500 h-2 rounded-full transition-all" 
                                style={{width: `${Math.min((maxStars / 16) * 100, 100)}%`}}
                             />
                         </div>
                         {!hasStarstruck && (
                            <div className="text-xs text-yellow-500/80 pt-2">
                                You need {starsNeeded} more stars on your best repo.
                            </div>
                         )}
                    </div>
                </div>

                {/* --- NEW SECTION: The Story --- */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                    <h2 className="text-2xl font-bold mb-4">🚀 Why this app?</h2>
                    <p className="text-gray-300 leading-relaxed max-w-2xl">
                        This tool was born from a late-night hacking session to &quot;gamify&quot; open source.
                        We realized GitHub Profiles are the new CVs, and achievements are the trophies.
                        <br/><br/>
                        Built with <strong>Next.js 14</strong>, <strong>NextAuth</strong>, and the <strong>GitHub GraphQL API</strong>,
                        this project demonstrates how to authenticate users and query deep profile stats in real-time.
                        <br/><br/>
                        <span className="italic text-purple-400">&quot;Code is just a game where you write the rules.&quot;</span>
                    </p>
                    
                    <div className="mt-6 flex gap-4">
                         <a 
                            href={`https://twitter.com/intent/tweet?text=I%20just%20checked%20my%20GitHub%20Stats%20on%20Badge%20Scanner!%20Check%20yours:%20https://badge-scanner.vercel.app`}
                            target="_blank"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                         >
                            Share on Twitter
                         </a>
                         <a 
                            href="https://github.com/LuisSambrano/github-achievements-speedrun"
                            target="_blank"
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                         >
                            Get the Code
                         </a>
                    </div>
                </div>

                {/* --- NEW SECTION: Badge Encyclopedia --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                    <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-800">
                        <strong className="text-white block mb-1">❄️ Arctic Code Vault</strong>
                        Contributed code to specific repos before 02/02/2020. (Snapshot taken).
                    </div>
                     <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-800">
                        <strong className="text-white block mb-1">🚁 Mars 2020</strong>
                        Contributed to repositories used in the Mars Helicopter mission.
                    </div>
                     <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-800">
                        <strong className="text-white block mb-1">💖 Public Sponsor</strong>
                        Sponsor an open source developer via GitHub Sponsors (Even $1).
                    </div>
                </div>
            </div>
        </div>
    </main>
  )
}
