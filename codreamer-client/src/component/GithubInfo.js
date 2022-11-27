import { useState } from "react";
import { Octokit } from "@octokit/core";
const GithubInfo = () => {
  const [linked, setLinked] = useState(false);
  const [username, setUsername] = useState("");
  const [totalCommitCount, setTotalCommitCount] = useState(0);
  const [commitCount, setCommitCount] = useState(0);
  const [PAT, setPAT] = useState("");

  const handlePAT = (e) => setPAT(e.target.value);

  const requestGithubUserInfo = async () => {
    const octokit = new Octokit({
      auth: PAT,
    });
    try {
      await octokit.request("GET /user", {}).then(async (res_1) => {
        const data = res_1.data;
        const my_username = data.login;
        await octokit
          .request("GET /repos/wildlife-programmer/codreamer/commits", {
            type: "public",
          })
          .then((res_2) => {
            const commits = res_2.data;
            const myCommits = commits.filter(
              (el) => el.commit.author.name === my_username
            );
            setTotalCommitCount(commits.length);
            setCommitCount(myCommits.length);
            setUsername(my_username);
            setLinked(true);
          });
      });
    } catch (err) {
      console.log("err", err);
    }
  };
  return (
    <>
      {linked ? (
        <>
          <span style={{ backgroundColor: "#fff" }}>ID: {username}</span>
          <span style={{ backgroundColor: "#fff" }}>
            내 커밋 횟수: {commitCount}
          </span>
          <span>총 커밋 횟수: {totalCommitCount}</span>
        </>
      ) : (
        <>
          <div>GithubInfo</div>
          <div>
            <span style={{ backgroundColor: "#fff" }}>깃허브 연동하기</span>
            <div>
              <input
                value={PAT}
                onChange={handlePAT}
                placeholder="내 PAT"
              ></input>
              <button onClick={requestGithubUserInfo}>정보 불러오기</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GithubInfo;
