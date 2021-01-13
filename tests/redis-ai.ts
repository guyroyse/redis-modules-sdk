import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisAI } from '../modules/redis-ai';
import * as fs from 'fs';
let client: RedisAI;
const key1 = 'key1cmk'
const key2 = 'key1cmk2';

describe('AI testing', async function() {
    before(async () => {
        client = new RedisAI({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('tensorset function', async () => {
        let response = await client.tensorset('values-key', 'FLOAT', [2, 2], [1, 2 ,3, 4])
        expect(response).eql('OK', 'The response of tensorset')
        response = await client.tensorset('blob-key', 'FLOAT', [1], [Buffer.from('1.11111')])
        expect(response).eql('OK', 'The response of tensorset')
    });
    it('tensorget function', async () => {
        let response = await client.tensorget('values-key', 'VALUES')
        console.log(response)
        response = await client.tensorget('blob-key', 'BLOB')
        console.log(response)
    });
    it('modelset function', async () => {
        //you need to import a model file via fs.readFileAsync
        const file = fs.readFileSync('../models/model1.onnx')
        const response = await client.modelset('blob-key', 'TF', 'CPU', file, {
            inputs: ['mytensor'],
            outputs: ['classes', 'predictions']
        })
        console.log(response)
    });
    it('modelget function', async () => {
        const response = await client.modelget('values-key', true);
        console.log(response);
    });
    it('modelrun function', async () => {
        const response = await client.modelrun('values-key', ['mytensor'], ['classes', 'predictions'])
        console.log(response)
    });
    it('modelscan function', async () => {
        const response = await client.modelscan();
        console.log(response);
    });
    it('modeldel function', async () => {
        const response = await client.modeldel('values-key');
        console.log(response)
    });
    it('scriptset function', async () => {
        const response = await client.scriptset('values-key', {
            device: 'CPU',
            script: 'addtwo.py'
        })
        console.log(response)
    });
    it('scriptget function', async () => {
        const response = await client.scriptget('values-key');
        console.log(response)
    });
    it('scriptdel function', async () => {
        const response = await client.scriptdel('values-key');
        console.log(response)
    });
    it('scriptrun function', async () => {
        const response = await client.scriptrun('values-key', 'addtwo', ['mytensor1', 'mytensor2'], ['result'])
        console.log(response)
    });
    it('scriptscan function', async () => {
        const response = await client.scriptscan();
        console.log(response)
    });
    it('dagrun function', async () => {
        const response = await client.dagrun([
            'AI.TENSORSET mytensor FLOAT 1 2 VALUES 5 10'
        ], undefined, {
            keyCount: 1,
            keys: ['predictions']
        })
        console.log(response)
    });
    it('dagrunRO function', async () => {
        const response = await client.dagrun([
            'AI.TENSORSET mytensor FLOAT 1 2 VALUES 5 10'
        ], undefined, {
            keyCount: 1,
            keys: ['predictions']
        })
        console.log(response)
    }); 
    it('info function', async () => {
        let response = await client.info('values-key');
        console.log(response)
        response = await client.info('values-key', true);
        console.log(response)
    });
    it('config function', async () => {
        const response = await client.config('d/my-path', 'TF')
        console.log(response)
    });
})