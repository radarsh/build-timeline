package com.adarshr.buildtimeline
import groovy.json.JsonOutput
import hudson.Extension
import hudson.model.AbstractProject
import hudson.model.ViewDescriptor
import hudson.util.ListBoxModel
import jenkins.model.Jenkins
import org.kohsuke.stapler.DataBoundConstructor
import org.kohsuke.stapler.StaplerRequest
import org.kohsuke.stapler.bind.JavaScriptMethod

import static hudson.Functions.getResourcePath
import static hudson.util.ListBoxModel.Option

class BuildTimelineView extends AbstractView {

    String upstreamJob

    @DataBoundConstructor
    BuildTimelineView(String name, String upstreamJob) {
        super(name)
        this.upstreamJob = upstreamJob
    }

    @Override
    protected void submit(StaplerRequest req) {
        upstreamJob = req.submittedForm.upstreamJob
    }

    @JavaScriptMethod
    String getTimelineData() {
        Set rows = []
        addDownstreamProjects(upstreamProject, rows)
        JsonOutput.toJson(rows)
    }

    String getResources() {
        "$resourcePath/plugin/build-timeline"
    }

    private AbstractProject getUpstreamProject() {
        Jenkins.instance.getItem(upstreamJob, Jenkins.instance, AbstractProject)
    }

    private void addDownstreamProjects(AbstractProject startProject, Set rows) {
        rows << getBuildMetadata(startProject)

        startProject.downstreamProjects?.collect {
            addDownstreamProjects(it, rows)
        }
    }

    private Map getBuildMetadata(AbstractProject project) {
        def lastBuild = project.lastSuccessfulBuild

        [
            name: project.name,
            start :lastBuild?.startTimeInMillis,
            end: lastBuild?.startTimeInMillis + lastBuild?.duration
        ]
    }

    @Extension
    static final class Descriptor extends ViewDescriptor {
        String displayName = 'Build Timeline View'

        ListBoxModel doFillUpstreamJobItems() {
            Jenkins.instance.jobNames.collect {
                new Option(it, it)
            }
        }
    }
}
