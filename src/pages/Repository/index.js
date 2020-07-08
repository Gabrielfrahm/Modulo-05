import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

// import { Container } from './styles';

export default class Repository extends Component {
    // eslint-disable-next-line react/static-property-placement
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string,
            }),
        }).isRequired,
    };

    /* eslint-disable react/state-in-constructor */
    state = {
        repository: {},
        issues: [],
        loading: true,
    };

    // faz chamadas na api baseada no localstorage
    async componentDidMount() {
        const { match } = this.props; // pegando os repositories

        const repoName = decodeURIComponent(match.params.repository); // constante que contem o repositorio clicado

        // execulta duas chamadas, uma para os repositorios outra pra o isssues em abertos
        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state: 'open',
                    per_page: 5,
                },
            }),
        ]);

        // amarzena os valores
        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false,
        });
    }

    render() {
        const { repository, issues, loading } = this.state;
        return <h1>Repository</h1>;
    }
}
