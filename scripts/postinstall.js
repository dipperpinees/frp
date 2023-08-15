const path = require('path')
const util = require('util')
const { pipeline } = require('stream');
const { existsSync, createWriteStream, mkdirSync, renameSync } = require('fs');
const extract = require('extract-zip');
const exec = util.promisify(require('child_process').exec);

require("isomorphic-fetch");

const FRP_PACKAGE_VERSION = "0.30.0";

const REPO = `https://github.com/fatedier/frp/releases/download/v${FRP_PACKAGE_VERSION}/`

const LINUX_URL = {
    arm64: 'linux_arm64.tar.gz',
    arm: 'linux_arm.tar.gz',
    x64: 'linux_amd64.tar.gz',
    ia32: 'linux_386.tar.gz',
    mips: 'linux_mips.tar.gz'
}

const MACOS_URL = {
    arm64: 'darwin_arm64.tar.gz',
    x64: 'darwin_amd64.tar.gz'
}

const WINDOWS_URL = {
    x64: 'windows_amd64.zip',
    ia32: 'windows_386.zip',
    arm64: 'windows_arm64.zip'
}

const ZIP_LIST = {
    linux: LINUX_URL[process.arch],
    darwin: MACOS_URL[process.arch],
    win32: WINDOWS_URL[process.arch],
}

async function downloadFile(url, to) {
    if (!existsSync(path.dirname(to))) {
        mkdirSync(path.dirname(to))
    }
    const streamPipeline = util.promisify(pipeline)
    const response = await fetch(url, { redirect: 'follow' })
    if (!response.ok) throw new Error("Couldn't download file")
    const fileObject = createWriteStream(to)
    await streamPipeline(response.body, fileObject)
    return to
}

async function install() {
    if (ZIP_LIST[process.platform] === undefined) {
        throw new Error(`Unsupported system platform: ${process.platform} or arch: ${process.arch}`)
    }
    const zipFileName = `frp_${FRP_PACKAGE_VERSION}_${ZIP_LIST[process.platform]}`

    const binPath = path.join(__dirname, "..", "bin")
    const zipPath = path.join(__dirname, "..", "bin", zipFileName);
    await downloadFile(REPO + zipFileName, zipPath);

    if (zipFileName.endsWith(".zip")) {
        await extract(zipPath, { dir: binPath })
    } else {
        await exec(`tar -xzf ${zipPath} -C ${binPath}`)
    }

    const binFolderName = zipFileName.replace(".zip", "").replace(".tar.gz", "")
    renameSync(path.join(__dirname, `../bin/${binFolderName}`, ), path.join(__dirname, `../bin/frp`))
}

install().catch(err => {
    throw err;
})

