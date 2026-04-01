'''Usage : python celery_service.py install (start / stop / remove)
Run celery as a Windows service
'''
import win32service
import win32serviceutil
import win32api
import win32con
import win32event
import subprocess
import sys
import os
import shlex
import logging
import time

# The directory for celery.log and celery_service.log
# Default: the directory of this script
BASEDIR = os.path.dirname(os.path.abspath(__file__))
# The path of python
# Usually it is in path_to/venv.
#PYTHONPATH = r'C:\Users\luiz.rocha\.conda\envs\weba1_venv'
PYTHONPATH = r'C:\A1Fer\venv\Scripts'
#PYTHONPATH = r'C:\Program Files\Python37'
# The directory name of django project
# Note: it is the directory at the same level of manage.py
# not the parent directory
PROJECTNAME = os.path.basename(BASEDIR)

logging.basicConfig(
    filename= os.path.join(BASEDIR, 'logs', 'service.log'),
    level=logging.DEBUG,
    format='[%(asctime)-15s: %(levelname)-7.7s] %(message)s'
    
)
#AUTH_USER_MODEL = 'a1hub.TbCtrlPendency'

class CeleryService(win32serviceutil.ServiceFramework):
    _svc_name_ = f"{PROJECTNAME}Celeryd"
    _svc_display_name_ = f"{PROJECTNAME} Celery worker service"
    _command = """{celery_path}" -A {proj_name} worker -f "{log_path}" -l info --concurrency 1000 --pool eventlet""".format(
            celery_path = os.path.join(PYTHONPATH, 'Scripts', 'celery.exe'),
            proj_name =PROJECTNAME,
            log_path = os.path.join(BASEDIR, 'logs', 'celery.log'))

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)

    def SvcStop(self):
        logging.info('Stopping {name} service ...'.format(name=self._svc_name_))
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.hWaitStop)
        self.ReportServiceStatus(win32service.SERVICE_STOPPED)
        sys.exit()

    def SvcDoRun(self):

        logging.info('Starting {name} service ...'.format(name=self._svc_name_))
        os.chdir(BASEDIR)  # so that proj worker can be found
        logging.info('cwd: ' + os.getcwd())
        self.ReportServiceStatus(win32service.SERVICE_RUNNING)
        logging.info('command: ' + self._command)
        args = shlex.split(self._command)
        proc = subprocess.Popen(args)
        logging.info('pid: {pid}'.format(pid=proc.pid))
        self.timeout = 3000
        while True:
            rc = win32event.WaitForSingleObject(self.hWaitStop, self.timeout)
            if rc == win32event.WAIT_OBJECT_0:
                # stop signal encountered
                # terminate process 'proc'
                PROCESS_TERMINATE = 1
                handle = win32api.OpenProcess(PROCESS_TERMINATE, False, proc.pid)
                win32api.TerminateProcess(handle, -1)
                win32api.CloseHandle(handle)
                break


class CeleryBeatService(CeleryService):
    _svc_name_ = f"{PROJECTNAME}Celerybeat"
    _svc_display_name_ = f"{PROJECTNAME} Celery beat service"
    _command = """"{celery_path}" -A {proj_name} beat -f "{log_path}" -l info""".format(
        celery_path = os.path.join(PYTHONPATH, 'Scripts', 'celery.exe'),
        proj_name = PROJECTNAME,
        log_path = os.path.join(BASEDIR, 'logs', 'celerybeat.log'))

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)

    def SvcDoRun(self):
        self.delete_arcs_residual()

    def SvcStop(self):
        logging.info('Stopping {name} service ...'.format(name=self._svc_name_))
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.hWaitStop)
        self.ReportServiceStatus(win32service.SERVICE_STOPPED)
        self.delete_arcs_residual()
        sys.exit()

    def delete_arcs_residual(self):
        list_arq_to_del = ['celerybeat.pid', 'celerybeat-schedule.bak', 'celerybeat-schedule.dat', 'celerybeat-schedule.dir']
        list_path_to_del = [os.path.join(BASEDIR, arc) for arc in list_arq_to_del]
        for path_file in list_path_to_del:
            try:
                os.remove(path_file)
            except:
                continue

class RunserverService(CeleryService):
    _svc_name_ = f"{PROJECTNAME}Runserver"
    _svc_display_name_ = f"{PROJECTNAME} Django runserver service"
    _command = '"{python_path}" manage.py runserver {options}'.format(
        python_path = os.path.join(PYTHONPATH, 'python.exe'),
        options ='--noreload')

if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(CeleryService)
    win32serviceutil.HandleCommandLine(CeleryBeatService)
    # win32serviceutil.HandleCommandLine(RunserverService)
