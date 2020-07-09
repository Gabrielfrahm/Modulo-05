import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
    // eslint-disable-next-line react/state-in-constructor
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
    };

    // pega o valor do input do fomulario
    // eslint-disable-next-line react/sort-comp
    handleInputChange = (e) => {
        this.setState({ newRepo: e.target.value });
    };

    // carrega os dados do localstorage
    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    // salvar os dados no localstorage
    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;
        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    // apos o submit do formulario
    handleSubmit = async (e) => {
        e.preventDefault();

        this.setState({ loading: true });

        // infromação do fomulario
        const { newRepo, repositories } = this.state;
        // preenche a url com os dados informados da url
        const response = await api.get(`/repos/${newRepo}`);

        // console.log(response.data);

        // resultado da api
        const data = {
            name: response.data.full_name,
        };
        // crai um novo vetor baseado no que ja existe no state, conceito de imutabilidade
        this.setState({
            repositories: [...repositories, data],
            newRepo: '',
            loading: false,
        });
    };

    render() {
        const { newRepo, loading, repositories } = this.state;
        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar Repositorio"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />
                    <SubmitButton loading={loading}>
                        {/* condicional render */}
                        {loading ? (
                            <FaSpinner color="#fff" size={15} />
                        ) : (
                            <FaPlus color="#fff" size={14} />
                        )}
                    </SubmitButton>
                </Form>
                <List>
                    {repositories.map((repository) => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    repository.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
