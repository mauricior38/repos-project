import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
  FilterList
} from "./styles";
import { FaArrowLeft } from "react-icons/fa";

import api from "../../services/api";

function Repositorio() {
  const { repositorio } = useParams();
  const [repositorioCall, setRepositoriocall] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState([
    {state: 'all', label: 'Todas', active: true},
    {state: 'open', label: 'Abertas', active: false},
    {state: 'closed', label: 'Fechadas', active: false},
  ])
  const [filterIndex, setFilterIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const nomeRepo = repositorio;

      //const response- = await api.get(`/repos/${nomeRepo}`)
      //const issues = await api.get(`/repos/${nomeRepo}`)

      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: filter.find(f => f.active).state,
            per_page: 5,
          },
        }),
      ]);
      setRepositoriocall(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
      console.log(repositorioCall);
    }

    load();
  }, []);

  useEffect(() => {
    async function loadIssue() {
      const nomeRepo = repositorio;

      const response = await api.get(`/repos/${nomeRepo}/issues`, {
        params: {
          state: filter[filterIndex].state,
          page,
          per_page: 5,
        },
    });
      setIssues(response.data);
    }

    loadIssue();
  }, [page, filterIndex, filter]);

  if (loading) {
    return (
      <Loading>
        <h1>Carregando</h1>
      </Loading>
    );
  }

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  function handleFilter(index){
    setFilterIndex(index);
  }

  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </BackButton>

      <Owner>
        <img
          src={repositorioCall.owner.avatar_url}
          alt={repositorioCall.owner.login}
        ></img>
        <h1>{repositorioCall.name}</h1>
        <p>{repositorioCall.description}</p>
      </Owner>

      <FilterList active={filterIndex}>
        {filter.map((filter, index) => (
            <button type="button" key={filter.label} onClick={() => handleFilter(index)}>
                {filter.label}
            </button>
        ))}
      </FilterList>

      <IssuesList>
        {issues.map((issue) => (
          <>
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />

              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>

                  {issue.labels.map((Label) => (
                    <span key={Label.id}>{Label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          </>
        ))}
      </IssuesList>

      <PageActions>
        <button type="button" onClick={() => handlePage("back")} disabled={page < 2}>
          Voltar
        </button>
        <button type="button" onClick={() => handlePage("next")}>
          Proxima
        </button>
      </PageActions>
    </Container>
  );
}

export default Repositorio;
