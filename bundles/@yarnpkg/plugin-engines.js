/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-engines",
factory: function (require) {
var plugin=(()=>{var P=Object.create,l=Object.defineProperty;var R=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames;var Y=Object.getPrototypeOf,b=Object.prototype.hasOwnProperty;var j=n=>l(n,"__esModule",{value:!0});var i=n=>{if(typeof require!="undefined")return require(n);throw new Error('Dynamic require of "'+n+'" is not supported')};var T=(n,e)=>{for(var r in e)l(n,r,{get:e[r],enumerable:!0})},V=(n,e,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of N(e))!b.call(n,t)&&t!=="default"&&l(n,t,{get:()=>e[t],enumerable:!(r=R(e,t))||r.enumerable});return n},s=n=>V(j(l(n!=null?P(Y(n)):{},"default",n&&n.__esModule&&"default"in n?{get:()=>n.default,enumerable:!0}:{value:n,enumerable:!0})),n);var U={};T(U,{default:()=>q});var o=s(i("@yarnpkg/core")),c;(function(r){r.Yarn="Yarn",r.Console="Console"})(c||(c={}));var h=class{constructor(e){this.throwWrongEngineError=(e,r)=>{let t=this.formatErrorMessage(e,r);this.throwError(t)};this.throwError=e=>{switch(this.errorReporter){case c.Yarn:this.reportYarnError(e);break;case c.Console:default:this.reportConsoleError(e);break}};this.reportYarnError=e=>{throw new o.ReportError(o.MessageName.UNNAMED,e)};this.reportConsoleError=e=>{console.error(e),process.exit(1)};this.formatErrorMessage=(e,r)=>{let{configuration:t}=this.project,p=o.formatUtils.applyStyle(t,o.formatUtils.pretty(t,this.engine,"green"),2),g=o.formatUtils.pretty(t,e,"cyan"),d=o.formatUtils.pretty(t,r,"cyan"),x=`The current ${p} version ${g} does not satisfy the required version ${d}.`;return o.formatUtils.pretty(t,x,"red")};this.project=e.project,this.errorReporter=e.errorReporter}};var f=s(i("fs")),y=s(i("path")),m=s(i("semver")),k=s(i("@yarnpkg/fslib")),a=s(i("@yarnpkg/core"));var v=class extends h{constructor(){super(...arguments);this.resolveNvmRequiredVersion=()=>{let{configuration:e,cwd:r}=this.project,t=(0,y.resolve)(k.npath.fromPortablePath(r),".nvmrc"),p=a.formatUtils.applyStyle(e,a.formatUtils.pretty(e,this.engine,"green"),2);if(!(0,f.existsSync)(t)){this.throwError(a.formatUtils.pretty(e,`Unable to verify the ${p} version. The .nvmrc file does not exist.`,"red"));return}let g=(0,f.readFileSync)(t,"utf-8").trim();if((0,m.validRange)(g))return g;let d=a.formatUtils.pretty(e,".nvmrc","yellow");this.throwError(a.formatUtils.pretty(e,`Unable to verify the ${p} version. The ${d} file contains an invalid semver range.`,"red"))}}get engine(){return"Node"}verifyEngine(e){let r=e.node;r!=null&&(r===".nvmrc"&&(r=this.resolveNvmRequiredVersion()),(0,m.satisfies)(process.version,r,{includePrerelease:!0})||this.throwWrongEngineError(process.version.replace(/^v/i,""),r.replace(/^v/i,"")))}};var C=s(i("semver")),E=s(i("@yarnpkg/core"));var u=class extends h{get engine(){return"Yarn"}verifyEngine(e){let r=e.yarn;r!=null&&((0,C.satisfies)(E.YarnVersion,r,{includePrerelease:!0})||this.throwWrongEngineError(E.YarnVersion,r))}};var w=n=>e=>{if(process.env.PLUGIN_YARN_ENGINES_DISABLE!=null)return;let{engines:r={}}=e.getWorkspaceByCwd(e.cwd).manifest.raw;console.log("engines",r),console.log("startingCwd",e.configuration.startingCwd);let t={project:e,errorReporter:n};[new v(t),new u(t)].forEach(g=>g.verifyEngine(r))},S={hooks:{validateProject:w(c.Yarn),setupScriptEnvironment:w(c.Console)}},q=S;return U;})();
return plugin;
}
};
