import React, { ChangeEvent, useEffect, useState } from 'react'
import { Container, Typography, TextField, Select, InputLabel, MenuItem, FormControl, FormHelperText, Button } from "@material-ui/core"
import './CadastrarProduto.css';
import { useNavigate, useParams } from 'react-router-dom';
import Categoria from '../../../model/Categoria';
import Produto from '../../../model/Produto';
import { busca, buscaId, post, put } from '../../../services/Service';
import { useSelector } from 'react-redux';
import { TokenState } from '../../../store/tokens/tokensReducer';


function CadastrarProduto() {
    let navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const token = useSelector<TokenState, TokenState["tokens"]>(
        (state) => state.tokens

    );

    useEffect(() => {
        if (token == "") {
            alert("Você precisa estar logado")
            navigate("/login")
        }
    }, [token])

    const [categoria, setCategoria] = useState<Categoria>(
        {
            id: 0,
            descricao: ''
        })
    const [produto, setProduto] = useState<Produto>({
        id: 0,
        nome: '',
        descricao: '',
        preco: 0,
        validade: '',
        regiao: '',
        fornecedor: '',
        unidade_de_medida: '',
        quantidade: 0,
        categoria: null,
        usuario: null,
    });

    useEffect(() => {
        setProduto({
            ...produto,
            categoria: categoria
        })
    }, [categoria])

    useEffect(() => {
        getCategorias()
        if (id !== undefined) {
            findByIdProduto(id)
        }
    }, [id])

    async function getCategorias() {
        await busca("/categorias", setCategorias, {
            headers: {
                'Authorization': token
            }
        })
    }

    async function findByIdProduto(id: string) {
        await buscaId(`produtos/${id}`, setProduto, {
            headers: {
                'Authorization': token
            }
        })
    }

    function updatedProduto(e: ChangeEvent<HTMLInputElement>) {

        setProduto({
            ...produto,
            [e.target.name]: e.target.value,
            categoria: categoria
        })

    }

    async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()

        if (id !== undefined) {
            put(`/produtos`, produto, setProduto, {
                headers: {
                    'Authorization': token
                }
            })
            alert('Produto atualizado com sucesso');
        } else {
            post(`/produtos`, produto, setProduto, {
                headers: {
                    'Authorization': token
                }
            })
            alert('Produto cadastrado com sucesso');
        }
        back()

    }

    function back() {
        navigate('/produtos')
    }

    return (
        <Container maxWidth="sm" className="topo">
            <form onSubmit={onSubmit}>
                <Typography variant="h3" color="textSecondary" component="h1" align="center" >Formulário de cadastro de produtos</Typography>
                <TextField value={produto.nome} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="nome" label="Nome" variant="outlined" name="nome" margin="normal" fullWidth />
                <TextField value={produto.descricao} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="descricao" label="Descricao" name="descricao" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.preco} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="preco" label="Preco" name="preco" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.validade} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="validade" label="Validade" name="validade" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.regiao} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="regiao" label="Regiao" name="regiao" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.fornecedor} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="fornecedor" label="Fornecedor" name="fornecedor" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.unidade_de_medida} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="unidade_de_medida" label="Unidade_De_Medida" name="unidade_de_medida" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.quantidade} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="quantidade" label="Quantidade" name="quantidade" variant="outlined" margin="normal" fullWidth />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="selectCategoria">Categorias</InputLabel>
                    <Select
                        labelId="selectCategoria"
                        onChange={(event) =>
                            buscaId(`/categorias/${event.target.value}`, setCategoria, {
                                headers: {
                                    Authorization: token,
                                },
                            })
                        }
                    >
                        {categorias.map(categoria => (
                            <MenuItem value={categoria.id}>{categoria.descricao}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Escolha uma categoria para seu produto</FormHelperText>
                    <Button type="submit" variant="contained" color="primary">
                        Finalizar
                    </Button>
                </FormControl>

            </form>
        </Container>
    )
}
export default CadastrarProduto;