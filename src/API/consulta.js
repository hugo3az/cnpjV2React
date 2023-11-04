import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import './consulta.css';
import { RiFileCopy2Line } from 'react-icons/ri';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cnpjValidator } from 'cnpj-validator';
import { BeatLoader } from 'react-spinners';
import Footer from '../footer/footer';


function Consulta() {
    const [cnpj, setCnpj] = useState('');
    const [companyData, setCompanyData] = useState(null);
    const [showData, setShowData] = useState(false);
    const [showNewConsultation, setShowNewConsultation] = useState(false);
    const [remainingConsultations, setRemainingConsultations] = useState(3);
    const [timeUntilNextConsultation, setTimeUntilNextConsultation] = useState(0);
    const [loading, setLoading] = useState(false); // Novo estado para controlar o carregamento
    const [errorMessage, setErrorMessage] = useState('');

    const handleCnpjChange = (event) => {
        const formattedCnpj = event.target.value.replace(/\D/g, '');
        setCnpj(formattedCnpj);
    };

    const handleCopyClick = (value) => {
        navigator.clipboard.writeText(value);
        toast.success('Conteúdo copiado com sucesso!');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchCompanyData();
        }
    };


    const fetchCompanyData = async () => {
        setLoading(true); // Ativa o carregamento durante a consulta
        if (!cnpjValidator(cnpj)) {
            setLoading(false);
            toast.error('CNPJ inválido! Verifique-o tente novamente.');
            return;
        }
        if (remainingConsultations === 0) {
            setLoading(false);
            toast.error('Limite de consultas excedido. Aguarde o próximo minuto para fazer uma nova consulta.');
            return;
        }
        try {
            const response = await axios.get(`https://publica.cnpj.ws/cnpj/${cnpj}`);
            
            // Check for a 404 status code and display a custom message
        if (response.status === 404) {
            setErrorMessage('CNPJ não encontrado na base de dados.');
            setLoading(false);
            return;
        }
            
            setCompanyData(response.data);
            setShowData(true);
            setRemainingConsultations(remainingConsultations - 1);
            setTimeUntilNextConsultation(60); // Tempo em segundos até a próxima consulta ser permitida
            setErrorMessage('');
        } catch (error) {
            console.error('Error fetching company data:', error);
            setErrorMessage('Ocorreu um erro ao buscar os dados da empresa. Por favor, tente novamente mais tarde.');
        }

        setLoading(false); // Desativa o carregamento após a conclusão da consulta
    };

    useEffect(() => {
        if (timeUntilNextConsultation > 0) {
            const timer = setInterval(() => {
                setTimeUntilNextConsultation(timeUntilNextConsultation - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (remainingConsultations === 0) {
            toast.info('Agora você pode fazer uma nova consulta.');
            setRemainingConsultations(3);
        }
    }, [timeUntilNextConsultation, remainingConsultations]);

    const handleNewConsultation = () => {
        setCnpj('');
        setShowData(false);
        setShowNewConsultation(false);
        setCompanyData(null);
    };


    return (
        <div className="Consulta">
            {loading ? (
                <div className="loading-container">
                    <BeatLoader color="#007bff" loading={true}/>
                </div>
            ) :  !showData ? (
                <>
                    <div className="input-container">
                        <h1>Consulta de CNPJ</h1>
                        <label htmlFor="cnpj">Digite o CNPJ:</label>
                        <InputMask
                            mask="99.999.999/9999-99"
                            id="cnpj"
                            value={cnpj}
                            onChange={handleCnpjChange}
                            onKeyPress={handleKeyPress}
                            className="input-mask"
                            style={{
                                /* width: '50%', */
                                padding: '0.5rem',
                                fontSize: '1rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        /><br />
                        <button onClick={fetchCompanyData}>Consultar</button>
                    </div>
                </>
            ) : (
                <div>
                    <div className='h1'>
                    <h1>Consulta de CNPJ</h1>
                    </div>
                    <div className="company-info">
                        <div className="column">
                            <div>
                                <label>NOM DA EMPRESA:</label>
                                <input type="text" readOnly value={companyData.razao_social} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.razao_social)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>FANTASIA:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.nome_fantasia} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.nome_fantasia)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>CNPJ:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.cnpj} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.cnpj)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>INSCRIÇÃO ESTADUAL:</label>
                                <input type="text" readOnly value={companyData?.estabelecimento?.inscricoes_estaduais[0]?.inscricao_estadual} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.inscricoes_estaduais[0].inscricao_estadual)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>TIPO:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.tipo} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.tipo)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>PORTE:</label>
                                <input type="text" readOnly value={companyData.porte.descricao} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.porte.descricao)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>ABERTURA:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.data_inicio_atividade} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.data_inicio_atividade)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>ATIVIDADE PRINCIPAL:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.atividade_principal.descricao} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.atividade_principal.descricao)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>NATUREZA JURIDICA:</label>
                                <input type="text" readOnly value={companyData.natureza_juridica.descricao} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.natureza_juridica.descricao)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>LOGRADOURO:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.logradouro} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.logradouro)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                        </div>

                        <div className="column">
                            <div>
                                <label>NUMERO:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.numero} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.numero)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>COMPLEMENTO:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.complemento} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.complemento)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>CEP:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.cep} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.cep)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>BAIRRRO:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.bairro} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.bairro)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>MUNICIPIO:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.cidade.nome} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.cidade.nome)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>UF:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.estado.sigla} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.estado.sigla)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>EMAIL:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.email} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.email)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>TELEFONE:</label>
                                <input type="text" readOnly value={companyData.estabelecimento.telefone1} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.estabelecimento.telefone1)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>SOCIOS:</label>
                                <div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={companyData.socios.map(socio => socio.nome).join(', ')}
                                    />
                                    <button className='copy' onClick={() => handleCopyClick(companyData.socios.map(socio => socio.nome).join(', '))}>
                                        <RiFileCopy2Line />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label>CAPITAL SOCIAL:</label>
                                <input type="text" readOnly value={companyData.capital_social} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.capital_social)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showData ? (
                <>
                    <div className="center-button-container">
                        <button className="center-button" onClick={handleNewConsultation}>Nova Consulta</button>
                    </div>
                </>
            ) : (
                <div className="timer-container">
                    {remainingConsultations === 0 && (
                        <p className='aguarde'>Limimte de 3 consultas por minuto atingido.<br/>
                            Aguarde {timeUntilNextConsultation} segundos para fazer uma nova consulta</p>
                    )}
                    </div>
            )}
            <ToastContainer />
            <Footer/>
        </div>
    );
}

export default Consulta;

