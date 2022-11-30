import { useState } from "react";
import { Octokit } from "@octokit/core";
import GitHubIcon from "@mui/icons-material/GitHub";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
const GithubInfo = ({ app }) => {
  const [open, setOpen] = useState(false);
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
      <div className="github_icon" onClick={() => setOpen(true)}>
        <GitHubIcon />
      </div>
      <div className={open ? "github_on" : "github_off"}>
        {open && (
          <CancelIcon className="github_close" onClick={() => setOpen(false)} />
        )}
        {linked ? (
          <>
            <span style={{ backgroundColor: "#fff" }}>ID: {username}</span>
            <span style={{ backgroundColor: "#fff" }}>
              내 커밋 횟수: {commitCount}
            </span>
            <span>총 커밋 횟수: {totalCommitCount}</span>
          </>
        ) : (
          <div className="github_connect">
            <input
              onFocus={() => app.fire("move#disable", false)}
              onBlur={() => app.fire("move#able", true)}
              className="github_input"
              value={PAT}
              onChange={handlePAT}
              placeholder="내 PAT"
            ></input>
            <DownloadIcon
              className="github_button"
              onClick={requestGithubUserInfo}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default GithubInfo;
